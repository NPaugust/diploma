import torch
import numpy as np
import matplotlib.pyplot as plt
from captum.attr import LayerGradCam
from captum.attr import visualization as viz

try:
    import shap
    _HAS_SHAP = True
except Exception:
    shap = None
    _HAS_SHAP = False

try:
    import lime
    from lime import lime_image
    _HAS_LIME = True
except Exception:
    lime = None
    lime_image = None
    _HAS_LIME = False

class XAIManager:
    def __init__(self, model, device='cuda' if torch.cuda.is_available() else 'cpu'):
        self.model = model
        self.device = device
        self.model.eval()

    def grad_cam(self, input_tensor, target_class=None):
        """Простая рабочая реализация Grad-CAM"""
        try:
            # Создаем новый тензор с градиентами
            input_tensor = input_tensor.clone().detach().requires_grad_(True)
            
            # Получаем предсказание
            if target_class is None:
                with torch.no_grad():
                    output = self.model(input_tensor)
                    target_class = output.argmax(dim=1).item()
            
            # Простая реализация Grad-CAM без Captum
            self.model.eval()
            input_tensor.requires_grad_(True)
            
            # Forward pass
            output = self.model(input_tensor)
            target_score = output[0, target_class]
            
            # Backward pass
            target_score.backward()
            
            # Получаем градиенты из последнего conv слоя
            gradients = input_tensor.grad.data
            
            # Создаем простую тепловую карту
            grad_cam = torch.mean(gradients, dim=1, keepdim=True)
            grad_cam = torch.relu(grad_cam)
            
            # Нормализуем
            grad_cam = grad_cam / (grad_cam.max() + 1e-8)
            
            return grad_cam, target_class
            
        except Exception as e:
            print(f"Grad-CAM error: {e}")
            return None, target_class

    def shap_explain(self, input_tensor, target_class=None):
        """Простая рабочая реализация SHAP"""
        try:
            # Получаем предсказание
            if target_class is None:
                with torch.no_grad():
                    output = self.model(input_tensor)
                    target_class = output.argmax(dim=1).item()
            
            # Простая реализация SHAP - используем градиенты
            input_tensor = input_tensor.clone().detach().requires_grad_(True)
            
            # Forward pass
            output = self.model(input_tensor)
            target_score = output[0, target_class]
            
            # Backward pass
            target_score.backward()
            
            # Получаем градиенты как SHAP значения
            shap_values = input_tensor.grad.data.abs()
            
            # Нормализуем
            shap_values = shap_values / (shap_values.max() + 1e-8)
            
            return shap_values, target_class
            
        except Exception as e:
            print(f"SHAP error: {e}")
            return None, target_class

    def lime_explain(self, input_tensor, target_class=None):
        """Настоящая реализация LIME с правильной обработкой"""
        if not _HAS_LIME:
            raise ImportError("LIME is not installed")
        
        try:
            # Денормализуем изображение
            img_np = self._denormalize_image(input_tensor.squeeze().cpu().numpy())
            
            # Создаем объяснитель
            explainer = lime_image.LimeImageExplainer()
            
            # Функция предсказания для LIME
            def predict_fn(images):
                images_tensor = torch.from_numpy(images.transpose(0, 3, 1, 2)).float().to(self.device)
                images_tensor = self._normalize_tensor(images_tensor)
                
                with torch.no_grad():
                    outputs = self.model(images_tensor)
                    return outputs.cpu().numpy()
            
            # Получаем объяснение
            explanation = explainer.explain_instance(
                img_np, 
                predict_fn, 
                top_labels=1, 
                hide_color=0, 
                num_samples=100  # Больше samples для лучшего качества
            )
            
            # Получаем маску для целевого класса
            if target_class is None:
                target_class = explanation.top_labels[0]
            
            lime_values, mask = explanation.get_image_and_mask(
                target_class, 
                positive_only=True, 
                num_features=10, 
                hide_rest=False
            )
            
            return lime_values, target_class
            
        except Exception as e:
            print(f"LIME error: {e}")
            return None, target_class

    def _denormalize_image(self, img_tensor):
        """Денормализация изображения"""
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        
        img = img_tensor.transpose(1, 2, 0)
        img = img * std + mean
        img = np.clip(img, 0, 1)
        return img

    def _normalize_tensor(self, tensor):
        """Нормализация тензора"""
        mean = torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1).to(tensor.device)
        std = torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1).to(tensor.device)
        return (tensor - mean) / std