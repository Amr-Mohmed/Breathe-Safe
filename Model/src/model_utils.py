import torch
from torch.utils.data import Dataset, DataLoader
import torch.nn as nn

# ===== Dataset =====
class AQIDataset(Dataset):
    def __init__(self, df, feature_cols, target_col, window_size=7):
        self.df = df.reset_index(drop=True)
        self.feature_cols = feature_cols
        self.target_col = target_col
        self.window_size = window_size
        self.num_samples = len(df) - window_size

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        X = self.df[self.feature_cols].iloc[idx:idx+self.window_size].values.astype(np.float32)
        y = np.array(self.df[self.target_col].iloc[idx+self.window_size], dtype=np.float32)
        return torch.tensor(X), torch.tensor(y)