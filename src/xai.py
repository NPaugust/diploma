import torch
import numpy as np
import matplotlib.pyplot as plt
from captum.attr import LayerGradCam
from captum.attr import visualization as viz
import shap
from skimage.segmentation import slic

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

    def shap_explain(self, input_tensor, max_evals=500, batch_size=50):
        # SHAP for explanation of predictions
        def model_wrapper(x):
            x = torch.tensor(x).permute(0, 3, 1, 2).float() / 255.0
            x = x.to(self.device)
            with torch.no_grad():
                output = self.model(x)
                return output.cpu().numpy()

        # Use SLIC for segmentation
        segments = slic(input_tensor.squeeze().cpu().numpy(), n_segments=50, compactness=10)
        explainer = shap.explainers.Partition(segments, model_wrapper, max_evals=max_evals)
        shap_values = explainer(input_tensor.squeeze().cpu().numpy())
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

