import torch
from torch.utils.data import Dataset, DataLoader
import numpy as np
from PIL import Image
import os

class BrainTumorDataset(Dataset):
    def __init__(self, data_dir, transform=None, num_samples=1000):
        self.data_dir = data_dir
        self.transform = transform
        self.num_samples = num_samples
        self.classes = ['no_tumor', 'glioma', 'meningioma', 'pituitary']
        # Simulate data: generate random images
        self.data = self._generate_data()

    def _generate_data(self):
        data = []
        for i in range(self.num_samples):
            # Generate a random 128x128 image
            img = np.random.randint(0, 255, (128, 128, 3), dtype=np.uint8)
            label = np.random.randint(0, len(self.classes))
            data.append((img, label))
        return data

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img, label = self.data[idx]
        img = Image.fromarray(img)
        if self.transform:
            img = self.transform(img)
        return img, label

# Function to create DataLoader
def get_dataloader(data_dir, transform, batch_size=32, num_samples=1000):
    dataset = BrainTumorDataset(data_dir, transform, num_samples)
    return DataLoader(dataset, batch_size=batch_size, shuffle=True)

