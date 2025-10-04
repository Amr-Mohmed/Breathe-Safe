# 🌍 BreathSafe – Air Quality Prediction & Stakeholder Alerts

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

