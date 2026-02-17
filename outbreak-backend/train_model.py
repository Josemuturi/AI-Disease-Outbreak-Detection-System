import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import MinMaxScaler
import joblib
import os

# 1. Load Data
df = pd.read_csv('data/kenya_disease_data.csv')

# We will predict Malaria Cases as our primary target
data = df[['malaria_cases']].values
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

# 2. Prepare Sequences (Look back 3 months to predict the 4th)
def create_sequences(data, seq_length=3):
    x, y = [], []
    for i in range(len(data) - seq_length):
        x.append(data[i:i + seq_length])
        y.append(data[i + seq_length])
    return np.array(x), np.array(y)

X, y = create_sequences(scaled_data)

# 3. Build the LSTM Architecture
model = Sequential([
    LSTM(50, return_sequences=True, input_shape=(X.shape[1], 1)),
    Dropout(0.2),
    LSTM(50, return_sequences=False),
    Dropout(0.2),
    Dense(25),
    Dense(1)
])

model.compile(optimizer='adam', loss='mean_squared_error')

# 4. Train the Model
print("🚀 Training the AI Brain... please wait.")
model.fit(X, y, batch_size=1, epochs=10, verbose=1)

# 5. Save the Brain
if not os.path.exists('models'): os.mkdir('models')
model.save('models/outbreak_model.h5')
joblib.dump(scaler, 'models/scaler.pkl')

print("✅ Model training complete! Saved to models/outbreak_model.h5")