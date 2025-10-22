import torch
import torch.nn as nn
import torch.optim as optim
import os
from core.dataset import get_dataloader, BrainTumorDataset
from core.model import load_model, save_model
from torchvision import transforms
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import glob
from torch.utils.data import Subset
from torch.utils.data import WeightedRandomSampler
import numpy as np

def train_model(data_dir, num_epochs=5, batch_size=32, learning_rate=3e-4, num_samples=None, resume_from=None):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    # Define transformations
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(224, scale=(0.85, 1.0)),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(degrees=5),
        transforms.ColorJitter(brightness=0.1, contrast=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    val_transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # Load dataset and model
    # Build dataset once, then split indices into train/val
    full_dataset_for_split = BrainTumorDataset(data_dir=data_dir, transform=val_transform)
    num_samples = len(full_dataset_for_split)
    indices = list(range(num_samples))
    train_idx, val_idx = train_test_split(indices, test_size=0.15, shuffle=True, random_state=42)

    train_dataset = BrainTumorDataset(data_dir=data_dir, transform=train_transform)
    val_dataset = BrainTumorDataset(data_dir=data_dir, transform=val_transform)
    train_subset = Subset(train_dataset, train_idx)
    val_subset = Subset(val_dataset, val_idx)

    # Build weighted sampler to upsample rare classes
    with torch.no_grad():
        train_labels = []
        for idx in train_idx:
            _, y = train_dataset[idx]
            train_labels.append(int(y))
        label_tensor = torch.tensor(train_labels)
        class_sample_count = torch.bincount(label_tensor, minlength=full_dataset_for_split.num_classes).float()
        weights_per_class = 1.0 / (class_sample_count + 1e-6)
        samples_weight = weights_per_class[label_tensor]
        sampler = WeightedRandomSampler(weights=samples_weight, num_samples=len(samples_weight), replacement=True)

    train_loader = torch.utils.data.DataLoader(train_subset, batch_size=batch_size, sampler=sampler, num_workers=2, pin_memory=False)
    val_loader = torch.utils.data.DataLoader(val_subset, batch_size=batch_size, shuffle=False, num_workers=2, pin_memory=False)
    
    # Get actual number of classes from dataset
    num_classes = full_dataset_for_split.num_classes
    model = load_model(num_classes=num_classes, device=device)
    
    # Resume from checkpoint if specified
    start_epoch = 0
    if resume_from and os.path.exists(resume_from):
        print(f"Resuming training from {resume_from}")
        checkpoint = torch.load(resume_from, map_location=device)
        model.load_state_dict(checkpoint)
        # Extract epoch number from filename if possible
        if 'epoch' in resume_from:
            try:
                start_epoch = int(resume_from.split('epoch')[-1].split('.')[0])
                print(f"Resuming from epoch {start_epoch}")
            except:
                print("Could not extract epoch number from filename")
    
    # Save class mapping for API
    os.makedirs('models', exist_ok=True)
    full_dataset_for_split.save_class_mapping('models/class_mapping.json')

    # Define loss and optimizer
    # Compute class weights to handle imbalance
    with torch.no_grad():
        label_list = []
        for i in train_idx:
            _, y = train_dataset[i]
            label_list.append(int(y))
        counts = torch.bincount(torch.tensor(label_list), minlength=num_classes).float()
        weights = (counts.sum() / (counts + 1e-6))
        weights = weights / weights.mean()
    criterion = nn.CrossEntropyLoss(weight=weights.to(device))
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=num_epochs)
    
    print(f"Training with {num_classes} classes")
    print(f"Class distribution: {counts.tolist()}")
    print(f"Class weights: {weights.tolist()}")

    # Training
    best_val_acc = 0.0
    best_path = 'models/brain_tumor_model_best.pth'
    epochs_no_improve = 0
    patience = 3
    for epoch in range(start_epoch, num_epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)

            # MixUp augmentation
            use_mixup = np.random.rand() < 0.5
            if use_mixup:
                lam = np.random.beta(0.4, 0.4)
                index = torch.randperm(inputs.size(0)).to(device)
                mixed_inputs = lam * inputs + (1 - lam) * inputs[index, :]
                targets_a, targets_b = labels, labels[index]
                optimizer.zero_grad()
                outputs = model(mixed_inputs)
                loss = lam * criterion(outputs, targets_a) + (1 - lam) * criterion(outputs, targets_b)
            else:
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        scheduler.step()
        train_acc = 100 * correct / total

        # Validation
        model.eval()
        val_correct = 0
        val_total = 0
        all_preds = []
        all_targets = []
        with torch.no_grad():
            for v_inputs, v_labels in val_loader:
                v_inputs, v_labels = v_inputs.to(device), v_labels.to(device)
                v_outputs = model(v_inputs)
                _, v_pred = torch.max(v_outputs.data, 1)
                val_total += v_labels.size(0)
                val_correct += (v_pred == v_labels).sum().item()
                all_preds.append(v_pred.cpu())
                all_targets.append(v_labels.cpu())
        val_acc = 100 * val_correct / val_total
        print(f"Epoch {epoch+1}/{num_epochs} | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}% | Loss: {running_loss/len(train_loader):.4f}")

        # Metrics per class
        y_true = torch.cat(all_targets).numpy()
        y_pred = torch.cat(all_preds).numpy()
        report = classification_report(y_true, y_pred, digits=3)
        print(report)
        # Save confusion matrix image
        try:
            import matplotlib.pyplot as plt
            import seaborn as sns
            cm = confusion_matrix(y_true, y_pred)
            plt.figure(figsize=(8, 6))
            sns.heatmap(cm, annot=False, cmap='Blues')
            os.makedirs('models', exist_ok=True)
            plt.savefig(f'models/confusion_epoch{epoch+1}.png', bbox_inches='tight', dpi=150)
            plt.close()
        except Exception:
            pass

        # Save best
        os.makedirs('models', exist_ok=True)
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            save_model(model, best_path)
            epochs_no_improve = 0
        else:
            epochs_no_improve += 1
            if epochs_no_improve >= patience:
                print(f"Early stopping at epoch {epoch+1} (no improvement for {patience} epochs).")
                break

        # Save model after each epoch
        os.makedirs('models', exist_ok=True)
        save_model(model, f'models/brain_tumor_model_epoch{epoch+1}.pth')
        # Update the main model file
        save_model(model, 'models/brain_tumor_model.pth')

    # Save final and copy best to main
    os.makedirs('models', exist_ok=True)
    save_model(model, 'models/brain_tumor_model.pth')
    if os.path.exists(best_path):
        # Overwrite main with best
        import shutil
        shutil.copyfile(best_path, 'models/brain_tumor_model.pth')
        print(f"Best model (Val Acc: {best_val_acc:.2f}%) copied to models/brain_tumor_model.pth")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', type=str, default='data/Training')
    parser.add_argument('--epochs', type=int, default=5)
    parser.add_argument('--batch', type=int, default=32)
    parser.add_argument('--lr', type=float, default=3e-4)
    parser.add_argument('--resume', type=str, default=None, help='Path to checkpoint to resume from')
    args = parser.parse_args()
    train_model(args.data, num_epochs=args.epochs, batch_size=args.batch, learning_rate=args.lr, resume_from=args.resume)

