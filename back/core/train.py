import torch
import torch.nn as nn
import torch.optim as optim
import os
from core.dataset import get_dataloader
from core.model import load_model, save_model
from torchvision import transforms
from sklearn.model_selection import train_test_split
import glob
from torch.utils.data import Subset

def train_model(data_dir, num_epochs=5, batch_size=32, learning_rate=3e-4, num_samples=None):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    # Define transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # Load dataset and model
    # Build dataset once, then split indices into train/val
    full_loader = get_dataloader(data_dir, transform, batch_size=1, shuffle=False)
    num_samples = len(full_loader.dataset)
    indices = list(range(num_samples))
    train_idx, val_idx = train_test_split(indices, test_size=0.15, shuffle=True, random_state=42)

    train_subset = Subset(full_loader.dataset, train_idx)
    val_subset = Subset(full_loader.dataset, val_idx)

    train_loader = torch.utils.data.DataLoader(train_subset, batch_size=batch_size, shuffle=True)
    val_loader = torch.utils.data.DataLoader(val_subset, batch_size=batch_size, shuffle=False)
    model = load_model(num_classes=4, device=device)

    # Define loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=num_epochs)

    # Training
    best_val_acc = 0.0
    best_path = 'models/brain_tumor_model_best.pth'
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for inputs, labels in train_loader:
            inputs, labels = inputs.to(device), labels.to(device)

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
        with torch.no_grad():
            for v_inputs, v_labels in val_loader:
                v_inputs, v_labels = v_inputs.to(device), v_labels.to(device)
                v_outputs = model(v_inputs)
                _, v_pred = torch.max(v_outputs.data, 1)
                val_total += v_labels.size(0)
                val_correct += (v_pred == v_labels).sum().item()
        val_acc = 100 * val_correct / val_total
        print(f"Epoch {epoch+1}/{num_epochs} | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}% | Loss: {running_loss/len(train_loader):.4f}")

        # Save best
        os.makedirs('models', exist_ok=True)
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            save_model(model, best_path)

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
    args = parser.parse_args()
    train_model(args.data, num_epochs=args.epochs, batch_size=args.batch, learning_rate=args.lr)

