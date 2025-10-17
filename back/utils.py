import torch
import matplotlib.pyplot as plt
from PIL import Image
import numpy as np
from torchvision import transforms


def load_image(image_path):
    """Loads an image and converts it to a tensor"""
    img = Image.open(image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    img_tensor = transform(img).unsqueeze(0)
    return img_tensor


def denormalize(tensor):
    """Denormalizes a tensor for visualization"""
    mean = np.array([0.485, 0.456, 0.406])
    std = np.array([0.229, 0.224, 0.225])
    tensor = tensor.squeeze().cpu().numpy().transpose(1, 2, 0)
    tensor = std * tensor + mean
    tensor = np.clip(tensor, 0, 1)
    return tensor


def plot_predictions(image, pred_class, classes):
    """Displays the image with the predicted class"""
    plt.imshow(image)
    plt.title(f"Predicted class: {classes[pred_class]}")
    plt.axis('off')
    plt.show()

