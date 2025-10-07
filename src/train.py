import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import os
from src.dataset import get_dataloader
from src.model import load_model, save_model
from torchvision import transforms

def train_model(data_dir, num_epochs=10, batch_size=32, learning_rate=0.001, num_samples=1000):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Using device: {device}")

    # Define transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    # Load dataset and model
    train_loader = get_dataloader(data_dir, transform, batch_size, num_samples)
    model = load_model(num_classes=4, device=device)

    # Define loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)

    # Training
    model.train()
    for epoch in range(num_epochs):
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
        accuracy = 100 * correct / total
        print(f"Epoch {epoch+1}/{num_epochs}, Loss: {running_loss/len(train_loader):.4f}, Accuracy: {accuracy:.2f}%")

        # Save model after each epoch
        os.makedirs('models', exist_ok=True)
        save_model(model, f'models/brain_tumor_model_epoch{epoch+1}.pth')
        # Also update the main model file for Streamlit
        save_model(model, 'models/brain_tumor_model.pth')

    # Save model
    os.makedirs('models', exist_ok=True)
    save_model(model, 'models/brain_tumor_model.pth')
    print("Model saved to models/brain_tumor_model.pth")

if __name__ == "__main__":
    train_model('data/raw', num_epochs=5, batch_size=16)  # For demonstration, reduce epochs

