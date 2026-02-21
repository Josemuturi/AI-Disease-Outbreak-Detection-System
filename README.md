# AI-Driven Disease Outbreak Surveillance System 🇰🇪

## 📌 Project Overview
A full-stack predictive analytics platform designed to monitor and forecast disease outbreaks across Kenyan counties. By leveraging historical health data and environmental factors, the system provides real-time risk assessments to aid public health decision-making.

### Key Features:
* **AI Inference Engine:** Uses a pre-trained **LSTM (Long Short-Term Memory)** neural network for time-series forecasting.
* **Interactive Dashboard:** A modern Next.js interface for visualizing risk levels (e.g., Nairobi: 95%).
* **Geospatial Metadata:** Integrated GIS coordinate systems (EPSG:4326) for mapping county boundaries.
* **RESTful API:** A high-performance FastAPI backend with automated OpenAPI (Swagger) documentation.

---

## 🏗️ System Architecture
The system follows a **Decoupled Architecture**, separating the heavy computational logic (AI) from the user interface.



### 1. Frontend (The Face)
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS
* **State Management:** React Hooks (useEffect, useState) for handling asynchronous API calls and loading spinners.

### 2. Backend (The Brain)
* **Framework:** FastAPI (Python)
* **Server:** Uvicorn (ASGI)
* **AI Logic:** TensorFlow/Keras for loading and running the `.h5` model.
* **Data Handling:** Pandas for processing CSV-based health surveillance records.

---

## 🚀 Getting Started

### Backend Setup
1. Navigate to `/backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the server: `python -m uvicorn main:app --reload`
4. Access API Docs: `http://127.0.0.1:8000/docs`

### Frontend Setup
1. Navigate to `/frontend`
2. Install modules: `npm install`
3. Run development server: `npm run dev`
4. Access Dashboard: `http://localhost:3000`

---

## 📊 Data & Model Methodology
* **Model Architecture:** Recurrent Neural Network (RNN) using LSTM layers.
* **Training Data:** Historical infection rates and climate variables stored in CSV format.
* **Evaluation Metrics:** The model focuses on minimizing Mean Squared Error (MSE) to ensure high-accuracy outbreak predictions.

---

## 🛠️ Future Roadmap
- [ ] **Database Migration:** Transitioning from CSV to a persistent SQLite/PostgreSQL layer.
- [ ] **Live Mapping:** Integrating Leaflet.js/Mapbox for real-time GIS visualization.
- [ ] **Automated Reporting:** PDF generation for Ministry of Health stakeholders.

**Lead Developer:** Joseph Muturi  
**Supervisor:** Dr. Ndinda  
**Graduation Target:** August 2026
