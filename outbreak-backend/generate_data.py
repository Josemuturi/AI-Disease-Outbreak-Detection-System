import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_kenya_health_data():
    # 47 Counties of Kenya
    counties = [
        "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita Taveta", "Garissa", 
        "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka Nithi", "Embu", 
        "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", 
        "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", 
        "Elgeyo Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", 
        "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", 
        "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
    ]
    
    start_date = datetime(2015, 1, 1)
    # Generate enough days to hit 30000 rows (30000 / 47 = 638.3)
    # We will generate 640 days
    date_range = [start_date + timedelta(days=x) for x in range(640)]

    all_data = []

    for county in counties:
        for date in date_range:
            month = date.month
            
            # --- ENVIRONMENTAL FACTORS (Kenya Met Dept) ---
            # Seasonal rainfall (Long rains: Mar-May, Short rains: Oct-Dec)
            base_rain = 5
            if month in [3, 4, 5]: base_rain = 15 + np.random.normal(0, 5)
            if month in [10, 11]: base_rain = 10 + np.random.normal(0, 3)
            rainfall = max(0, base_rain + np.random.normal(0, 2))
            
            # Temperature (Nairobi cooler, Mombasa hotter, etc.)
            if county in ["Mombasa", "Kilifi", "Lamu", "Kwale"]:
                temp = 28 + np.random.normal(0, 2)
            elif county in ["Nairobi", "Kiambu", "Nyeri"]:
                temp = 20 + np.random.normal(0, 2)
            else:
                temp = 24 + np.random.normal(0, 3)

            # --- DISEASE LOGIC (WHO & HMIS) ---
            # Malaria spikes after rain and heat (from HMIS)
            malaria_cases = int(max(0, (rainfall * 0.5) + (temp * 0.8) + np.random.normal(5, 10)))
            
            # Cholera occasionally spikes during heavy rain (from WHO)
            cholera_cases = int(max(0, (rainfall * 0.7) + np.random.normal(0, 5))) if rainfall > 15 else np.random.randint(0, 3)

            all_data.append({
                "date": date,
                "county": county,
                "rainfall_mm": round(rainfall, 2),
                "avg_temp_c": round(temp, 2),
                "malaria_cases": malaria_cases,
                "cholera_cases": cholera_cases
            })

    # Convert to DataFrame
    df = pd.DataFrame(all_data)
    
    # Strictly limit to 30000 rows
    df = df.iloc[:30000]

    # --- 1. SIMULATE KENYA METEOROLOGICAL DATA ---
    met_df = df[["date", "county", "rainfall_mm", "avg_temp_c"]]
    met_df.to_csv("data/kenya_met_data.csv", index=False)
    
    # --- 2. SIMULATE HMIS DATA (Malaria) ---
    hmis_df = df[["date", "county", "malaria_cases"]]
    hmis_df.to_csv("data/hmis_data.csv", index=False)
    
    # --- 3. SIMULATE WHO DATA (Cholera) ---
    who_df = df[["date", "county", "cholera_cases"]]
    who_df.to_csv("data/who_data.csv", index=False)
    
    print("Created source datasets: kenya_met_data.csv, hmis_data.csv, who_data.csv")

    # --- MERGE PROCESS ---
    merged_df = pd.merge(hmis_df, who_df, on=["date", "county"])
    merged_df = pd.merge(merged_df, met_df, on=["date", "county"])
    
    # Calculate Risk Score
    merged_df["risk_score"] = round(np.clip((merged_df["malaria_cases"] + merged_df["cholera_cases"]) / 5, 0, 99), 2)
    
    # Save the final Merged File
    merged_df.to_csv("data/kenya_disease_data.csv", index=False)
    print(f"Success! 'data/kenya_disease_data.csv' has been generated with EXACTLY {len(merged_df)} rows by merging the 3 sources.")

if __name__ == "__main__":
    if not os.path.exists('data'): os.mkdir('data')
    generate_kenya_health_data()