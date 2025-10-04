# Breathe-Safe
2025 NASA Space Apps Challenge From EarthData to Action: Cloud Computing with Earth Observation Data for Predicting Cleaner, Safer Skies

Breathe Safe is a modern, open-source web application for real-time air quality monitoring and public health awareness. It leverages NASA TEMPO satellite data, ground-based sensor networks, and weather integration to deliver actionable insights, stakeholder dashboards, and educational resources for individuals, schools, emergency services, and policymakers.


## Project Overview
This project predicts air quality by leveraging multiple data sources and building a time-series prediction model. The workflow includes data collection, preprocessing, modeling, and deployment via an API.

## Data Sources
The data was collected from three resources:
1. **Real-time TEMPO** – Satellite-based measurements of air pollutants.  
2. **Ground Data (OpenAQ API)** – Sensor-based measurements from multiple locations.  
3. **Weather Data API** – Meteorological parameters influencing air quality.

All collected data was converted to **Excel format** for easier handling and processing.

## Data Processing
- Cleaning and preprocessing of collected datasets.  
- Standardization of units and timestamp alignment.  
- Merging datasets to create a unified dataset ready for modeling.

## Modeling
- Implemented a **Time Series LSTM model** for air quality forecasting.  
- The model was trained on historical data from the combined sources.

## API Deployment
- Created a **FastAPI endpoint** to serve model predictions.  
- Users can request air quality forecasts by sending parameters to the API.

## Project Flow

```mermaid
flowchart TD
    subgraph DataSources["Data Collection"]
        A1[TEMPO Satellite<br/>Air Pollutants]
        A2[OpenAQ API<br/>Ground Sensors]
        A3[Weather API<br/>Meteorological Data]
    end
    
    A1 --> B[Data Conversion & Processing]
    A2 --> B
    A3 --> B
    
    B --> C[Merged Dataset<br/>Excel Format]
    C --> D[Time Series LSTM Model<br/>Training]
    D --> E[FastAPI Deployment]
    E --> F[API Predictions]
    
    style DataSources fill:#e1f5ff
    style B fill:#fff4e1
    style C fill:#e8f5e9
    style D fill:#f3e5f5
    style E fill:#fce4ec
    style F fill:#fff9c4
 
## Frontend
## 🌎 Key Features
- **Real-time AQI monitoring** and historical air quality trends
- **Stakeholder views:** General Public, Schools, Senior Care, Emergency Response
- **Data sources:** NASA TEMPO, ground-based networks, weather data
- **Past event storytelling:** Las Vegas wildfire impact
- **Health tips & public awareness:** Actionable recommendations and resources
- **Subscription system:** Get AQI alerts for your city
- **Modern UI:** Responsive, glass-morphism design with custom SVG illustrations

## 🚀 Tech Stack
- Angular 19 (standalone components)
- Chart.js / ng2-charts for interactive data visualization
- TypeScript, HTML, CSS
- Custom SVG assets and illustrations

## 🛠️ Getting Started
1. **Clone the repository:**
	```bash
	git clone https://github.com/<your-org-or-username>/Breathe-Safe.git
	```
2. **Install dependencies:**
	```bash
	cd Web.Client
	npm install
	```
3. **Run the development server:**
	```bash
	npm start
	```
4. **Open** [http://localhost:4200](http://localhost:4200) in your browser.

## 📁 Frontend Project Structure
- `src/app/` — Angular components and routes
- `src/assets/images/` — Custom SVGs and images
- `public/` — Favicon and static assets

## Backend 
## 🌍 BreathSafe – Air Quality Prediction & Stakeholder Alerts Backend

This project is part of the **NASA Space Apps Challenge – From EarthData to Action**.  
It combines **AI-powered air quality predictions** with **stakeholder notifications** to help protect vulnerable groups, support decision-makers, and keep communities safer.

---

## 📌 Project Overview

- **Data Input** → We send environmental features (Days CO, NO2, Ozone, PM2.5, PM10) to a **FastAPI AI model**.  
- **Prediction** → FastAPI returns a predicted AQI (Air Quality Index).  
- **Storage** → Prediction is saved using a **generic repository pattern** with EF Core.  
- **Categorization & Alerts** → Stakeholders are notified when AQI exceeds thresholds.  

This ensures communities, schools, governments, and health-sensitive groups can **take timely action**.

---

## 🏗 Architecture

### ✅ Models
- **`Subscriber`** → Represents stakeholders (e.g., Schools, ElderCare, Health-Sensitive Groups).  
- **`AirQualityPrediction`** → Stores prediction results (AQI, date, advisory).  

- **`AirQualityRequest`** → Input request DTO for sending features to FastAPI.  

### ✅ Services
- **`AirQualityPredictionService`**
  - Fetches predictions from FastAPI.  
  - Stores them in DB.  
  - Queries history (today, last week, last month).  
  - Triggers notifications when AQI crosses thresholds.  

- **`SubscriberService`**
  - Manages subscribers.  
  - Sends notifications to specific subscriber groups.  

### ✅ Repository Pattern
A **generic repository** provides CRUD operations for all entities.

---

## ⚙️ Service Logic

### `AirQualityPredictionService`
- **AddAirQualityData** → Stores prediction and triggers AQI categorization logic.  
- **GetAirQualityPredictionsAsync** → Calls FastAPI with `AirQualityRequest`, receives AQI, saves, and notifies subscribers.  
- **Query Methods**  
  - `GetTodayAirQualityFor(location)`  
  - `GetLastWeekAirQualityFor(location)`  
  - `GetLastMonthAirQualityFor(location)`  

#### AQI Threshold → Notification Rules
- **101–150** → Notify ElderCare, Industrial Zone Residents, Health-Sensitive Groups  
- **151–200** → Notify Health-Sensitive Groups  
- **201–300** → Notify Health-Sensitive Groups + Disaster Readiness Orgs  
- **301–500** → Notify all critical stakeholders (Health, Crisis, Meteorological, Govt, Public, etc.)  

---

### `SubscriberService`
- **AddSubscriber** → Registers new stakeholder.  
- **Notify** → Retrieves subscribers by type and (future) sends alerts (email, SMS, push).  

---

## 🔗 API Integration

FastAPI endpoint is consumed via `HttpClient`:

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss your ideas. 
>>>>>>> webApplication
