
import streamlit as st
import torch
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from captum.attr import visualization as viz
import shap
from src.model import load_checkpoint, load_model
from src.xai import XAIManager
from utils import load_image, denormalize, plot_predictions


# Load model
device = 'cuda' if torch.cuda.is_available() else 'cpu'
model = load_checkpoint(load_model(), 'models/brain_tumor_model.pth', device)
xai_manager = XAIManager(model, device)
classes = ['no_tumor', 'glioma', 'meningioma', 'pituitary']

st.title("Brain Tumor Classification with XAI")
st.write("Upload an MRI image for classification and explanation.")

st.write("\n**Select XAI method:**")
method = st.radio("Explanation method", ["Grad-CAM", "SHAP"], horizontal=True)

uploaded_file = st.file_uploader("Choose an image", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    try:
        image = Image.open(uploaded_file).convert('RGB')
        st.image(image, caption="Uploaded image", use_column_width=True)
        img_tensor = load_image(uploaded_file).to(device)
        with torch.no_grad():
            output = model(img_tensor)
            pred_class = output.argmax(dim=1).item()
        st.write(f"Predicted class: **{classes[pred_class]}**")
        if method == "Grad-CAM":
            st.subheader("Explanation: Grad-CAM")
            attributions = xai_manager.grad_cam(img_tensor, pred_class)
            fig, ax = plt.subplots()
            viz.visualize_image_attr(
                attributions[0].cpu().numpy(),
                np.array(image),
                method="heat_map",
                sign="absolute_value",
                show_colorbar=True,
                plt_fig_axis=(fig, ax),
                title="Grad-CAM importance map"
            )
            st.pyplot(fig)
        elif method == "SHAP":
            st.subheader("Explanation: SHAP")
            shap_values = xai_manager.shap_explain(img_tensor)
            fig, ax = plt.subplots()
            try:
                shap.plots.waterfall(shap_values[0], show=False, ax=ax)
                st.pyplot(fig)
            except Exception as e:
                st.error(f"SHAP visualization error: {e}")
    except Exception as e:
        st.error(f"Image processing error: {e}")

