from src.fetch_data import get_openaq_latest, get_weather_now, get_weather_forecast, get_tempo_no2

lat, lon = 40.7128, -74.0060  # نيويورك

print("OpenAQ:", get_openaq_latest(lat, lon))
print("Weather now:", get_weather_now(lat, lon))
print("Forecast next hours:", get_weather_forecast(lat, lon, hours=6))
print("TEMPO NO2:", get_tempo_no2(lat, lon))
