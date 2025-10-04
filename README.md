# Breathe-Safe
2025 NASA Space Apps Challenge From EarthData to Action: Cloud Computing with Earth Observation Data for Predicting Cleaner, Safer Skies

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
```
