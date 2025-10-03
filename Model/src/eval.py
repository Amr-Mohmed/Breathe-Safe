from torch.utils.data import DataLoader

test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False)

all_preds = []
all_targets = []

with torch.no_grad():
    for X_batch, y_batch in test_loader:
        y_pred = model(X_batch)  # تنبؤ
        all_preds.extend(y_pred.numpy())
        all_targets.extend(y_batch.numpy())

all_preds = np.array(all_preds)
all_targets = np.array(all_targets)

for i in range(10):
    print(f"Predicted: {all_preds[i]:.2f}, Actual: {all_targets[i]:.2f}")
