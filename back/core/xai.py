import torch
import numpy as np
import matplotlib.pyplot as plt
from captum.attr import LayerGradCam
from captum.attr import visualization as viz
try:
    import shap  # optional, used only when SHAP method is requested
    _HAS_SHAP = True
except Exception:
    shap = None
    _HAS_SHAP = False

class XAIManager:
    def __init__(self, model, device='cuda' if torch.cuda.is_available() else 'cpu'):
        self.model = model
        self.device = device
        self.model.eval()

    def grad_cam(self, input_tensor, target_class=None):
        # Use LayerGradCam for visualization (GradCam is not available in this Captum version)
        layer = self.model.backbone.layer4[2].conv3  # Last conv layer in ResNet
        grad_cam = LayerGradCam(self.model, layer)
        if target_class is None:
            # Predict class
            with torch.no_grad():
                output = self.model(input_tensor)
                target_class = output.argmax(dim=1).item()
        attributions = grad_cam.attribute(input_tensor, target=target_class)
        return attributions

    def shap_explain(self, input_tensor, num_samples=50):
        # SHAP for explanation of predictions using DeepExplainer
        if not _HAS_SHAP:
            raise ImportError("SHAP is not installed. Please install 'shap' to use this method.")
        # Create background data (random noise)
        background = torch.randn(num_samples, 3, 224, 224).to(self.device)
        
        # Use DeepExplainer which works better with PyTorch models
        explainer = shap.DeepExplainer(self.model, background)
        shap_values = explainer.shap_values(input_tensor)
        
        return shap_values

    def visualize_explanations(self, original_image, attributions, method='gradcam'):
        # Visualization of explanations
        if method == 'gradcam':
            viz.visualize_image_attr(attributions[0].cpu().numpy(), original_image, method="heat_map", sign="absolute_value", show_colorbar=True, title="Grad-CAM")
        elif method == 'shap':
            plt.imshow(attributions)
            plt.title("SHAP Explanation")
            plt.axis('off')
            plt.show()

