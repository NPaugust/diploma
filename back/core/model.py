import torch
import torch.nn as nn
from torchvision import models

class BrainTumorModel(nn.Module):
    def __init__(self, num_classes=4, pretrained=True):
        super(BrainTumorModel, self).__init__()
        # Use pretrained ResNet50
        self.backbone = models.resnet50(pretrained=pretrained)
        # Replace the last layer for our number of classes
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, num_classes)
        # Add dropout for regularization
        self.dropout = nn.Dropout(0.5)

    def forward(self, x):
        x = self.backbone(x)
        x = self.dropout(x)
        return x

# Function to load the model
def load_model(num_classes=4, device='cuda' if torch.cuda.is_available() else 'cpu'):
    model = BrainTumorModel(num_classes)
    model.to(device)
    return model

# Function to save the model
def save_model(model, path):
    torch.save(model.state_dict(), path)

# Function to load model checkpoint
def load_checkpoint(model, path, device='cuda' if torch.cuda.is_available() else 'cpu'):
    model.load_state_dict(torch.load(path, map_location=device))
    model.to(device)
    return model
