import requests
import netCDF4 as nc

# ------------------------
# 1) OpenAQ (PM2.5 + NO2)
# ------------------------
def get_openaq_latest(lat, lon):
    url = f"https://api.openaq.org/v2/latest?coordinates={lat},{lon}&radius=10000&limit=1"
    try:
        r = requests.get(url)
        data = r.json()
        if "results" not in data or len(data["results"]) == 0:
            return 0.0, 0.0

        measurements = data["results"][0]["measurements"]
        pm25 = next((m["value"] for m in measurements if m["parameter"] == "pm25"), 0.0)
        no2 = next((m["value"] for m in measurements if m["parameter"] == "no2"), 0.0)
        return pm25, no2
    except Exception as e:
        print("OpenAQ Error:", e)
        return 0.0, 0.0


# ------------------------
# 2) Open-Meteo (Weather free)
# ------------------------
def get_weather(lat, lon):
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lon}&hourly=temperature_2m,windspeed_10m&current_weather=true"
    )
    try:
        r = requests.get(url)
        data = r.json()

        current = data.get("current_weather", {})
        temp = current.get("temperature", 0.0)
        wind = current.get("windspeed", 0.0)

        forecast = []
        hourly = data.get("hourly", {})
        times = hourly.get("time", [])
        temps = hourly.get("temperature_2m", [])
        winds = hourly.get("windspeed_10m", [])

        for i in range(min(6, len(times))):  # أول 6 ساعات
            forecast.append({
                "time": times[i],
                "temp": temps[i],
                "wind": winds[i],
            })

        return temp, wind, forecast
    except Exception as e:
        print("Weather Error:", e)
        return 0.0, 0.0, []


# ------------------------
# 3) TEMPO NO2 (from NetCDF file)
# ------------------------
def get_tempo_no2(filepath=r"E:\NASA\air-forecast\data\TEMPO_sample.nc"):
    try:
        ds = nc.Dataset(filepath)

        no2 = ds.groups["product"].variables["vertical_column_troposphere"][:]
        lat = ds.groups["geolocation"].variables["latitude"][:]
        lon = ds.groups["geolocation"].variables["longitude"][:]

        return no2, lat, lon
    except Exception as e:
        print("TEMPO Error:", e)
        return None, None, None


# ------------------------
# لو الملف اتشغل مباشرة
# ------------------------
if __name__ == "__main__":
    lat, lon = 40.7128, -74.0060  # نيويورك

    pm25, no2 = get_openaq_latest(lat, lon)
    print(f"OpenAQ → PM2.5: {pm25}, NO2: {no2}")

    temp, wind, forecast = get_weather(lat, lon)
    print(f"Weather now → Temp: {temp} °C | Wind: {wind} m/s")
    print("Forecast next 6h:")
    for f in forecast:
        print(f)

    no2, lat_arr, lon_arr = get_tempo_no2()
    if no2 is not None:
        print("TEMPO NO2 shape:", no2.shape)
