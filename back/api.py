import os
import torch
import numpy as np
import matplotlib.pyplot as plt
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import base64
from core.model import load_model
from core.xai import XAIManager, _HAS_SHAP, _HAS_LIME
from utils import load_image
from captum.attr import visualization as viz

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = load_model(num_classes=12, device=device)

# Load trained model weights
model_path = 'models/brain_tumor_model.pth'
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
    print(f"Loaded trained model from {model_path}")
else:
    print(f"Warning: Model file {model_path} not found, using untrained model")

model.eval()
xai_manager = XAIManager(model, device)

# Load classes
classes = ['carcinoma', 'ependimoma', 'ganglioglioma', 'germinoma', 'glioma', 'granuloma', 'medulloblastoma', 'meningioma', 'normal', 'pituitary', 'schwannoma', 'tuberculoma']

def tensor_to_base64_image(fig):
    """Convert matplotlib figure to base64 string"""
    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode()
    buf.close()
    plt.close(fig)
    return img_base64

def process_image(file_bytes, filename: str = ""):
    """Process uploaded image"""
    # Load image from bytes
    image = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    
    # Simple preprocessing
    image = image.resize((224, 224))
    img_array = np.array(image)
    img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).float() / 255.0
    
    # Normalize
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    img_tensor = (img_tensor - mean) / std
    
    # Add batch dimension and move to device
    img_tensor = img_tensor.unsqueeze(0).to(device)
    return img_tensor, image

@app.get("/health")
async def health_check():
    return {
        "status": "running",
        "device": device,
        "model_loaded": True,
        "model_path": "models/brain_tumor_model.pth",
        "num_classes": len(classes),
        "classes": classes,
        "shap_available": _HAS_SHAP,
        "lime_available": _HAS_LIME
    }

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        print(f"Processing file: {file.filename}")
        contents = await file.read()
        print(f"File size: {len(contents)} bytes")
        
        img_tensor, original_image = process_image(contents, file.filename)
        print(f"Image tensor shape: {img_tensor.shape}")
        
        with torch.no_grad():
            output = model(img_tensor)
            print(f"Model output shape: {output.shape}")
            probabilities = torch.softmax(output, dim=1)
            predicted_class_idx = output.argmax(dim=1).item()
            confidence = probabilities[0][predicted_class_idx].item()
        
        predicted_class = classes[predicted_class_idx]
        print(f"Predicted: {predicted_class} (confidence: {confidence:.3f})")
        print(f"Confidence before *100: {confidence}")
        print(f"Confidence after *100: {confidence * 100}")
        
        # Get probability distribution
        prob_dist = {}
        for i, class_name in enumerate(classes):
            prob_dist[class_name] = round(probabilities[0][i].item() * 100, 1)
        
        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 3),  # Возвращаем от 0 до 1, фронт сам умножит на 100
            "probability_distribution": prob_dist
        }
        
    except Exception as e:
        print(f"ERROR in predict: {str(e)}")
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"detail": f"Prediction error: {str(e)}"}
        )

@app.post("/api/explain")
async def explain(
    file: UploadFile = File(...),
    method: str = Form("gradcam"),
    predicted_class: str = Form(None)
):
    try:
        contents = await file.read()
        img_tensor, original_image = process_image(contents, file.filename)
        
        # Get target class
        if predicted_class:
            target_class = classes.index(predicted_class)
        else:
            with torch.no_grad():
                output = model(img_tensor)
                target_class = output.argmax(dim=1).item()
        
        # Generate explanation
        if method.lower() == 'gradcam':
            attributions, target_class = xai_manager.grad_cam(img_tensor, target_class)
            
            fig, ax = plt.subplots(figsize=(6, 4))
            
            if attributions is not None:
                # Простая визуализация Grad-CAM
                grad_cam_np = attributions[0].squeeze().cpu().numpy()
                
                # Показываем оригинальное изображение
                ax.imshow(np.array(original_image), alpha=0.8)
                # Накладываем Grad-CAM
                im = ax.imshow(grad_cam_np, cmap='jet', alpha=0.6)
                plt.colorbar(im, ax=ax, shrink=0.8, label='Grad-CAM Value')
                ax.set_title(f"Grad-CAM: {classes[target_class]}\nRed = High importance areas")
                ax.axis('off')
            else:
                ax.imshow(np.array(original_image))
                ax.set_title(f"Grad-CAM: {classes[target_class]}\n(Unable to generate heatmap)")
                ax.axis('off')
            
            img_base64 = tensor_to_base64_image(fig)
            
        elif method.lower() == 'shap':
            shap_values, target_class = xai_manager.shap_explain(img_tensor, target_class)
            
            fig, ax = plt.subplots(figsize=(6, 4))
            
            if shap_values is not None:
                # Простая визуализация SHAP
                shap_np = shap_values[0].squeeze().cpu().numpy()
                
                # Усредняем по каналам
                if len(shap_np.shape) == 3:
                    shap_np = np.mean(shap_np, axis=0)
                
                # Показываем оригинальное изображение
                ax.imshow(np.array(original_image), alpha=0.8)
                # Накладываем SHAP значения
                im = ax.imshow(shap_np, cmap='hot', alpha=0.6)
                plt.colorbar(im, ax=ax, shrink=0.8, label='SHAP Value')
                ax.set_title(f"SHAP: {classes[target_class]}\nRed = High importance areas")
                ax.axis('off')
            else:
                ax.imshow(np.array(original_image))
                ax.set_title(f"SHAP: {classes[target_class]}\n(Unable to generate SHAP values)")
                ax.axis('off')
            
            img_base64 = tensor_to_base64_image(fig)
            
        elif method.lower() == 'lime':
            lime_values, target_class = xai_manager.lime_explain(img_tensor, target_class)
            
            fig, ax = plt.subplots(figsize=(6, 4))
            
            if lime_values is not None:
                # Показываем оригинальное изображение
                ax.imshow(np.array(original_image), alpha=0.8)
                # Накладываем LIME значения
                im = ax.imshow(lime_values, cmap='RdBu_r', alpha=0.6)
                
                # Создаем colorbar с указателем
                cbar = plt.colorbar(im, ax=ax, shrink=0.8, label='LIME Value')
                
                # Добавляем указатель на максимальное значение
                max_val = np.max(np.abs(lime_values))
                # Нормализуем позицию указателя (от 0 до 1)
                norm_pos = (max_val + np.abs(lime_values.min())) / (lime_values.max() - lime_values.min())
                
                # Добавляем черную линию на colorbar
                cbar.ax.axhline(y=norm_pos, color='black', linewidth=2, linestyle='--', alpha=0.8)
                cbar.ax.text(1.1, norm_pos, f'Max: {max_val:.2f}', 
                           transform=cbar.ax.get_yaxis_transform(), 
                           ha='left', va='center', fontsize=8, 
                           bbox=dict(boxstyle='round,pad=0.3', facecolor='yellow', alpha=0.8))
                
                ax.set_title(f"LIME: {classes[target_class]}\nRed = Positive, Blue = Negative")
                ax.axis('off')
            else:
                ax.imshow(np.array(original_image))
                ax.set_title(f"LIME: {classes[target_class]}\n(Unable to generate LIME explanation)")
                ax.axis('off')
            
            img_base64 = tensor_to_base64_image(fig)
            
        else:
            return JSONResponse(
                status_code=400,
                content={"detail": f"Unknown method: {method}"}
            )
        
        return {
            "method": method,
            "explanation_image": img_base64,
            "predicted_class": classes[target_class],
        }
        
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": f"Explanation error: {str(e)}"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)