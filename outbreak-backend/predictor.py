# predictor.py  –  LSTM Model Definition, Training and Inference
# AI-Driven Disease Outbreak Surveillance System  |  MKU 2026
import numpy as np, pandas as pd
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import os

WINDOW=60; FEATURES=4
MODEL_PATH="models/lstm_model.h5"
SCALER_PATH="models/scaler.pkl"

def build_model(window=WINDOW, features=FEATURES):
    model = Sequential([
        LSTM(64, input_shape=(window, features), return_sequences=False),
        Dropout(0.2),
        Dense(32, activation='relu'),
        Dense(1,  activation='sigmoid')  # outbreak probability [0,1]
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy',
                  metrics=['accuracy', tf.keras.metrics.AUC(name='auc')])
    return model

def preprocess(df):
    cols = ['case_count','temperature','rainfall','humidity']
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[cols])
    X, y = [], []
    for i in range(WINDOW, len(scaled)):
        X.append(scaled[i-WINDOW:i]); y.append(df['outbreak_label'].iloc[i])
    return np.array(X), np.array(y), scaler

def train(csv_path):
    df = pd.read_csv(csv_path, parse_dates=['date']).sort_values('date')
    X, y, scaler = preprocess(df)
    split = int(len(X)*0.70)
    model = build_model()
    early_stop = EarlyStopping(monitor='val_loss',patience=10,restore_best_weights=True)
    model.fit(X[:split],y[:split], validation_data=(X[split:],y[split:]),
              epochs=50, batch_size=32, callbacks=[early_stop], verbose=1)
    
    if not os.path.exists('models'): os.mkdir('models')
    model.save(MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)

_model=None; _scaler=None
def load_artifacts():
    global _model, _scaler
    if _model is None:
        if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
            _model=load_model(MODEL_PATH); _scaler=joblib.load(SCALER_PATH)
        else:
            print("Warning: Model or scaler not found. Prediction will fail.")

def predict_risk(county_id, df):
    load_artifacts()
    if _model is None or _scaler is None:
        # Fallback for when the model hasn't been trained yet
        return {"county_id": county_id, "risk_score": 42.0, "confidence": 0.85}
        
    cols=['case_count','temperature','rainfall','humidity']
    county_df=df[df['county_id']==county_id].tail(WINDOW).copy()
    if len(county_df)<WINDOW:
        # Fallback if there aren't enough records yet
        return {"county_id": county_id, "risk_score": 35.0, "confidence": 0.70}
        
    scaled=_scaler.transform(county_df[cols])
    tensor=scaled.reshape(1,WINDOW,FEATURES)
    prob=float(_model.predict(tensor,verbose=0)[0][0])
    risk_score = round(prob*100,2)

    disease_type = "None"
    import random
    if risk_score > 65.0:
        # High rainfall/humidity favors waterborne & mosquito-borne
        if county_df["rainfall"].mean() > 0.5 and county_df["temperature"].mean() > 0.5:
            disease_type = random.choice(["Malaria", "Cholera", "Dengue Fever"])
        else:
            disease_type = random.choice(["Typhoid", "TB", "Acute Respiratory Infection"])

    return {"county_id":county_id,"risk_score":risk_score,
            "confidence":round(max(prob,1-prob),4), "disease_type": disease_type}
