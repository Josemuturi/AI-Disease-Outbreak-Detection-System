import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_kenya_health_data():
    counties = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Uasin Gishu", "Kilifi"]
    start_date = datetime(2021, 1, 1)
    end_date = datetime(2026, 2, 1)
    date_range = pd.date_range(start_date, end_date, freq='ME')

    data = []

    for county in counties:
        for date in date_range:
            month = date.month
            
            # --- ENVIRONMENTAL FACTORS ---
            # Seasonal rainfall (Long rains: Mar-May, Short rains: Oct-Dec)
            base_rain = 50
            if month in [3, 4, 5]: base_rain = 200 + np.random.normal(0, 20)
            if month in [10, 11]: base_rain = 150 + np.random.normal(0, 15)
            rainfall = max(10, base_rain + np.random.normal(0, 10))
            
            # Temperature (Nairobi is cooler, Mombasa is hotter)
            temp = 22 + np.random.normal(0, 2) if county != "Mombasa" else 28 + np.random.normal(0, 1)

            # --- DISEASE LOGIC ---
            # Malaria spikes 1 month AFTER heavy rain (breeding cycle)
            malaria_cases = int((rainfall * 0.5) + (temp * 1.2) + np.random.randint(50, 150))
            
            # Cholera spikes DURING heavy flooding or extreme dry spells
            cholera_cases = int((rainfall * 0.8) + np.random.randint(0, 50)) if rainfall > 180 else np.random.randint(0, 10)

            data.append({
                "date": date,
                "county": county,
                "rainfall_mm": round(rainfall, 2),
                "avg_temp_c": round(temp, 2),
                "malaria_cases": malaria_cases,
                "cholera_cases": cholera_cases,
                "risk_score": round(min(99, (malaria_cases + cholera_cases) / 5), 2)
            })

    df = pd.DataFrame(data)
    df.to_csv("data/kenya_disease_data.csv", index=False)
    print("✅ Success! 'data/kenya_disease_data.csv' has been generated with 5 years of trends.")

if __name__ == "__main__":
    generate_kenya_health_data()