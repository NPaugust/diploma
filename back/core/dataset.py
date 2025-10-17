import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import datasets
from PIL import Image
import os

DESIRED_CLASSES = ['no_tumor', 'glioma', 'meningioma', 'pituitary']

class BrainTumorKaggleDataset(Dataset):
    """ImageFolder wrapper that remaps labels to desired class order.

    Expected directory layout:
      root/
        train/ or val/ or test/ (you pass one of them in data_dir)
          glioma/
          meningioma/
          notumor/ (mapped to no_tumor)
          pituitary/
    """
    def __init__(self, data_dir: str, transform=None):
        self.transform = transform
        self.ifolder = datasets.ImageFolder(
            root=data_dir,
        )
        # Map folder names to our desired indices
        name_to_desired = {
            'notumor': 0,
            'no_tumor': 0,
            'no-tumor': 0,
            'glioma': 1,
            'glioma_tumor': 1,
            'meningioma': 2,
            'meningioma_tumor': 2,
            'pituitary': 3,
            'pituitary_tumor': 3,
        }
        # Build mapping from the ImageFolder class index to desired index
        self.remap = {}
        for cls_name, idx in self.ifolder.class_to_idx.items():
            if cls_name not in name_to_desired:
                raise ValueError(f"Unexpected class folder: {cls_name}")
            self.remap[idx] = name_to_desired[cls_name]

    def __len__(self):
        return len(self.ifolder)

    def __getitem__(self, idx):
        img, folder_idx = self.ifolder[idx]
        if self.transform:
            img = self.transform(img)
        label = self.remap[folder_idx]
        return img, label


def get_dataloader(data_dir: str, transform, batch_size=32, shuffle=True):
    dataset = BrainTumorKaggleDataset(data_dir=data_dir, transform=transform)
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle)

