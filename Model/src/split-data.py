%pip install scikit-learn

from sklearn.model_selection import train_test_split

X = daily_df.drop(columns=['AQI_Category'])
y = daily_df['AQI_Category']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Train size:", X_train.shape[0])
print("Test size:", X_test.shape[0])