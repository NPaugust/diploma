from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
from PIL import Image
from torchvision import transforms
import io
import base64
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from core.model import load_model, load_checkpoint
from core.xai import XAIManager
from utils import load_image
from captum.attr import visualization as viz

app = FastAPI(title="Brain Tumor Classification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = None
xai_manager = None
classes = ['no_tumor', 'glioma', 'meningioma', 'pituitary']

@app.on_event("startup")
async def startup_event():
    global model, xai_manager
    try:
        model = load_model(num_classes=4, device=device)
        model = load_checkpoint(model, 'models/brain_tumor_model.pth', device)
        model.eval()
        xai_manager = XAIManager(model, device)
        print(f"Model loaded successfully on {device}")
    except Exception as e:
        print(f"Warning: Could not load model - {e}")
        print("Using dummy mode for development")

def process_image(file_bytes):
    image = Image.open(io.BytesIO(file_bytes)).convert('RGB')
    # Robust center-crop + resize to reduce aspect-ratio artifacts
    aug = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    img_tensor = aug(image).unsqueeze(0).to(device)
    return img_tensor, image

def tensor_to_base64_image(fig):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight', dpi=150)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)
    return img_base64

@app.get("/")
async def root():
    return {"message": "Brain Tumor Classification API", "status": "running"}

@app.post("/api/predict")
async def predict(file: UploadFile = File(...), method: str = Form("gradcam")):
    try:
        if model is None:
            return JSONResponse(
                status_code=503,
                content={"detail": "Model not loaded. Please train the model first."}
            )
        
        contents = await file.read()
        img_tensor, original_image = process_image(contents)
        
        with torch.no_grad():
            output = model(img_tensor)
            probabilities = torch.softmax(output, dim=1)[0]
            predicted_class_idx = output.argmax(dim=1).item()
            predicted_class = classes[predicted_class_idx]
            confidence = probabilities[predicted_class_idx].item()
        
        probs_dict = {classes[i]: probabilities[i].item() for i in range(len(classes))}
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "probabilities": probs_dict,
        }
    
    except Exception as e:
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
        if model is None or xai_manager is None:
            return JSONResponse(
                status_code=503,
                content={"detail": "Model not loaded. Please train the model first."}
            )
        
        contents = await file.read()
        img_tensor, original_image = process_image(contents)
        
        if predicted_class:
            target_class = classes.index(predicted_class)
        else:
            with torch.no_grad():
                output = model(img_tensor)
                target_class = output.argmax(dim=1).item()
        
        if method.lower() == 'gradcam':
            attributions = xai_manager.grad_cam(img_tensor, target_class)
            
            fig, ax = plt.subplots(figsize=(10, 10))
            viz.visualize_image_attr(
                attributions[0].detach().cpu().numpy(),
                np.array(original_image),
                method="heat_map",
                sign="absolute_value",
                show_colorbar=True,
                plt_fig_axis=(fig, ax),
                title=f"Grad-CAM: {classes[target_class]}"
            )
            
            img_base64 = tensor_to_base64_image(fig)
            
        elif method.lower() == 'shap':
            try:
                shap_values = xai_manager.shap_explain(img_tensor)
                shap_array = np.array(shap_values[target_class])
                
                fig, ax = plt.subplots(figsize=(10, 10))
                shap_img = shap_array.squeeze()
                if len(shap_img.shape) == 3:
                    shap_img = np.mean(np.abs(shap_img), axis=0)
                
                im = ax.imshow(shap_img, cmap='hot', interpolation='bilinear')
                plt.colorbar(im, ax=ax)
                ax.set_title(f"SHAP: {classes[target_class]}")
                ax.axis('off')
                
                img_base64 = tensor_to_base64_image(fig)
            except ImportError:
                return JSONResponse(
                    status_code=400,
                    content={"detail": "SHAP is not installed on server. Please install 'shap' or choose another XAI method (e.g., Grad-CAM)."}
                )
            
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

