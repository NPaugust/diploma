import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import datasets
from PIL import Image
import os
import json

# Extended class mapping for 12 tumor types
# Updated to match ImageFolder alphabetical order
CLASS_MAPPING = {
    # Carcinoma (metastasis) - ImageFolder index 0
    'carcinoma': 0, 'metastasis': 0, 'metastatic': 0, 'metastases': 0,
    
    # Ependimoma - ImageFolder index 1
    'ependimoma': 1, 'ependimoma_tumor': 1,
    
    # Ganglioglioma - ImageFolder index 2
    'ganglioglioma': 2, 'ganglioglioma_tumor': 2,
    
    # Germinoma - ImageFolder index 3
    'germinoma': 3, 'germinoma_tumor': 3,
    
    # Glioma (combine multiple types) - ImageFolder index 4
    'glioma': 4, 'glioma_tumor': 4, 'astrocitoma': 4, 'glioblastoma': 4, 
    'oligodendroglioma': 4, 'neurocitoma': 4,
    
    # Granuloma - ImageFolder index 5
    'granuloma': 5, 'granuloma_tumor': 5,
    
    # Medulloblastoma - ImageFolder index 6
    'medulloblastoma': 6, 'meduloblastoma': 6, 'medulloblastoma_tumor': 6,
    
    # Meningioma - ImageFolder index 7
    'meningioma': 7, 'meningioma_tumor': 7,
    
    # Normal/No tumor - ImageFolder index 8
    'normal': 8, 'no_tumor': 8, 'notumor': 8, 'no-tumor': 8,
    
    # Pituitary (papiloma is similar) - ImageFolder index 9
    'pituitary': 9, 'pituitary_tumor': 9, 'pituitary_adenoma': 9, 'papiloma': 9,
    
    # Schwannoma - ImageFolder index 10
    'schwannoma': 10, 'schwannoma_tumor': 10,
    
    # Tuberculoma - ImageFolder index 11
    'tuberculoma': 11, 'tuberculoma_tumor': 11
}

CLASS_NAMES = [
    'carcinoma', 'ependimoma', 'ganglioglioma', 'germinoma', 'glioma',
    'granuloma', 'medulloblastoma', 'meningioma', 'normal', 'pituitary',
    'schwannoma', 'tuberculoma'
]

class BrainTumorDataset(Dataset):
    """Universal brain tumor dataset that auto-detects classes from folder structure.
    
    Expected directory layout:
      data_dir/
        normal/ or no_tumor/ or notumor/
        glioma/ or astrocitoma/ or glioblastoma/ or oligodendroglioma/ or neurocitoma/
        meningioma/
        pituitary/ or papiloma/
        carcinoma/ or metastasis/
        ependimoma/
        ganglioglioma/
        germinoma/
        granuloma/
        medulloblastoma/ or meduloblastoma/
        schwannoma/
        tuberculoma/
    """
    def __init__(self, data_dir: str, transform=None):
        self.transform = transform
        self.data_dir = data_dir
        
        # Use ImageFolder to load data
        self.ifolder = datasets.ImageFolder(root=data_dir, transform=None)
        
        # Map ImageFolder classes to our internal class mapping
        self.samples = []
        self.class_to_idx = {}
        self.idx_to_class = {}
        
        # Build class mapping
        found_classes = set()
        for path, class_idx in self.ifolder.samples:
            folder_name = os.path.basename(os.path.dirname(path)).lower()
            mapped_class = None
            
            # Find matching class in our mapping
            for k, v in CLASS_MAPPING.items():
                if k in folder_name:
                    mapped_class = v
                    break
            
            if mapped_class is not None:
                self.samples.append((path, mapped_class))
                found_classes.add(mapped_class)
            else:
                print(f"Warning: Class folder '{folder_name}' not mapped. Skipping {path}")
        
        # Check if we have all 12 classes
        if len(found_classes) != 12:
            print(f"WARNING: Expected 12 classes but found {len(found_classes)} classes")
            missing_classes = set(range(12)) - found_classes
            print(f"Missing classes: {missing_classes}")
        
        # Build reverse mapping
        for class_idx in found_classes:
            class_name = CLASS_NAMES[class_idx]
            self.class_to_idx[class_name] = class_idx
            self.idx_to_class[class_idx] = class_name
        
        self.num_classes = len(found_classes)
        print(f"Found {self.num_classes} classes: {sorted(found_classes)}")
        print(f"Class mapping: {self.idx_to_class}")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        image = Image.open(img_path).convert('RGB')
        if self.transform:
            image = self.transform(image)
        return image, label

    def get_class_names(self):
        return [self.idx_to_class[i] for i in sorted(self.idx_to_class.keys())]

    def save_class_mapping(self, path: str):
        """Save class mapping to JSON file for API use"""
        mapping = {
            'num_classes': self.num_classes,
            'class_names': self.get_class_names(),
            'idx_to_class': self.idx_to_class,
            'class_to_idx': self.class_to_idx
        }
        with open(path, 'w') as f:
            json.dump(mapping, f, indent=2)


def get_dataloader(data_dir: str, transform, batch_size=32, shuffle=True, num_workers=0):
    dataset = BrainTumorDataset(data_dir=data_dir, transform=transform)
    return DataLoader(dataset, batch_size=batch_size, shuffle=shuffle, num_workers=num_workers)

