import numpy as np

class TimeSeriesGenerator:
    def __init__(self, df, feature_cols, target_col, window_size=7, batch_size=64):
        self.df = df.reset_index(drop=True)
        self.feature_cols = feature_cols
        self.target_col = target_col
        self.window_size = window_size
        self.batch_size = batch_size
        self.num_samples = len(df) - window_size

    def __len__(self):
        return int(np.ceil(self.num_samples / self.batch_size))

    def __iter__(self):
        for start in range(0, self.num_samples, self.batch_size):
            end = min(start + self.batch_size, self.num_samples)
            X_batch, y_batch = [], []
            for i in range(start, end):
                X_batch.append(self.df[self.feature_cols].iloc[i:i+self.window_size].values)
                y_batch.append(self.df[self.target_col].iloc[i+self.window_size])
            yield np.array(X_batch), np.array(y_batch)