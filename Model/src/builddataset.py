import requests
import xarray as xr
import pandas as pd
import datetime
import numpy as np
import time

# ---------- APIs ----------
def fetch_openaq(lat, lon):
    """Fetch PM2.5 and NO2 from OpenAQ"""
    try:
        url = f"https://api.openaq.org/v2/latest?coordinates={lat},{lon}&radius=50000&limit=1"
        r = requests.get(url, timeout=10).json()
        results = r.get("results", [])
        if not results:
            return {"pm25": 0.0, "no2": 0.0}

        measurements = results[0].get("measurements", [])
        pm25 = next((m["value"] for m in measurements if m["parameter"] == "pm25"), 0.0)
        no2 = next((m["value"] for m in measurements if m["parameter"] == "no2"), 0.0)

        return {"pm25": pm25, "no2": no2}
    except Exception as e:
        print("OpenAQ error:", e)
        return {"pm25": 0.0, "no2": 0.0}

def fetch_weather(lat, lon):
    """Fetch weather (using free met.no API)"""
    try:
        url = f"https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}"
        headers = {"User-Agent": "air-quality-research-app/1.0"}
        r = requests.get(url, headers=headers, timeout=10).json()

        now_data = r["properties"]["timeseries"][0]["data"]["instant"]["details"]
        temp = now_data.get("air_temperature", None)
        wind = now_data.get("wind_speed", None)

        forecast = []
        for t in r["properties"]["timeseries"][1:7]:
            forecast.append({
                "time": t["time"],
                "temp": t["data"]["instant"]["details"].get("air_temperature", None),
                "wind": t["data"]["instant"]["details"].get("wind_speed", None)
            })

        return {"temp": temp, "wind": wind, "forecast": forecast}
    except Exception as e:
        print("Weather error:", e)
        return {"temp": None, "wind": None, "forecast": []}

def fetch_tempo(lat, lon, tempo_file):
    """Fetch NO2 column from TEMPO file (nearest grid cell)"""
    try:
        ds = xr.open_dataset(tempo_file)

        lats = ds["latitude"].values
        lons = ds["longitude"].values
        no2 = ds["vertical_column_troposphere"].values

        dist = (lats - lat) ** 2 + (lons - lon) ** 2
        iy, ix = np.unravel_index(np.argmin(dist), lats.shape)

        return float(no2[iy, ix])
    except Exception as e:
        print("TEMPO error:", e)
        return None

# ---------- Helper Functions ----------
def get_season(date):
    """تحديد الفصل بناءً على الشهر"""
    month = date.month
    if month in [12, 1, 2]:
        return 'winter'
    elif month in [3, 4, 5]:
        return 'spring'
    elif month in [6, 7, 8]:
        return 'summer'
    else:  # 9, 10, 11
        return 'fall'

def generate_realistic_no2(base_value, city_type, season, hour, is_weekend):
    """
    توليد قيم NO2 واقعية بناءً على عوامل متعددة
    
    القيم النموذجية لـ NO2 (µg/m³):
    - مدن كبيرة: 20-80
    - مدن متوسطة: 10-40
    - مدن صغيرة: 5-25
    """
    
    # تحديد قيمة أساسية بناءً على حجم المدينة
    if city_type == "major":  # مدن كبيرة
        base = np.random.uniform(30, 60)
    elif city_type == "medium":  # مدن متوسطة
        base = np.random.uniform(15, 35)
    else:  # مدن صغيرة
        base = np.random.uniform(8, 20)
    
    # إذا كان عندنا قيمة من الـ API، استخدمها كأساس
    if base_value and base_value > 0:
        base = base_value
    
    # تأثير الفصل
    season_factors = {
        'winter': 1.3,   # تلوث أعلى في الشتاء (تدفئة)
        'spring': 1.0,   # معتدل
        'summer': 0.85,  # أقل (رياح وأمطار)
        'fall': 1.1      # معتدل - مرتفع
    }
    no2 = base * season_factors.get(season, 1.0)
    
    # تأثير ساعة اليوم (Rush hours)
    if 7 <= hour <= 9 or 17 <= hour <= 19:
        no2 *= np.random.uniform(1.4, 1.8)  # ذروة الصباح والمساء
    elif 22 <= hour or hour <= 5:
        no2 *= np.random.uniform(0.5, 0.7)  # ليلاً (حركة مرور قليلة)
    
    # تأثير نهاية الأسبوع
    if is_weekend:
        no2 *= np.random.uniform(0.6, 0.8)
    
    # إضافة تنويع عشوائي
    no2 *= np.random.uniform(0.85, 1.15)
    
    return round(max(5, no2), 2)  # الحد الأدنى 5

def generate_realistic_pm25(base_value, city_type, season, hour, is_weekend):
    """توليد قيم PM2.5 واقعية"""
    
    if city_type == "major":
        base = np.random.uniform(15, 35)
    elif city_type == "medium":
        base = np.random.uniform(8, 20)
    else:
        base = np.random.uniform(5, 12)
    
    if base_value and base_value > 0:
        base = base_value
    
    # تأثير الفصل
    season_factors = {
        'winter': 1.4,
        'spring': 1.0,
        'summer': 0.8,
        'fall': 1.2
    }
    pm25 = base * season_factors.get(season, 1.0)
    
    # تأثير ساعة اليوم
    if 7 <= hour <= 9 or 17 <= hour <= 19:
        pm25 *= np.random.uniform(1.3, 1.6)
    elif 22 <= hour or hour <= 5:
        pm25 *= np.random.uniform(0.6, 0.8)
    
    if is_weekend:
        pm25 *= np.random.uniform(0.7, 0.9)
    
    pm25 *= np.random.uniform(0.9, 1.1)
    
    return round(max(3, pm25), 2)

def generate_realistic_tempo_no2(season, city_type):
    """
    توليد قيم TEMPO NO2 واقعية (عمود استوائي)
    الوحدة: molecules/cm²
    القيم النموذجية: 1e15 to 5e15
    """
    
    if city_type == "major":
        base = np.random.uniform(2.5e15, 4.5e15)
    elif city_type == "medium":
        base = np.random.uniform(1.5e15, 3.0e15)
    else:
        base = np.random.uniform(0.8e15, 2.0e15)
    
    season_factors = {
        'winter': 1.25,
        'spring': 1.0,
        'summer': 0.85,
        'fall': 1.1
    }
    
    tempo = base * season_factors.get(season, 1.0)
    tempo *= np.random.uniform(0.9, 1.1)
    
    return tempo

def classify_city(city_name):
    """تصنيف المدينة حسب الحجم"""
    major_cities = ["New York", "Los Angeles", "Chicago", "Houston", "Toronto", 
                    "Montreal", "Mexico City", "Phoenix", "Philadelphia"]
    
    if any(major in city_name for major in major_cities):
        return "major"
    elif "City" in city_name or len(city_name) > 15:
        return "medium"
    else:
        return "small"

# ---------- Synthetic Data Generator ----------
def generate_multiple_samples(lat, lon, city, country, base_openaq, base_weather, base_tempo, num_samples=30):
    """
    توليد أمثلة متنوعة مع تغطية كل الفصول
    """
    records = []
    city_type = classify_city(city)
    
    # توزيع الأمثلة على 4 فصول بالتساوي
    samples_per_season = num_samples // 4
    
    seasons_months = {
        'winter': [12, 1, 2],
        'spring': [3, 4, 5],
        'summer': [6, 7, 8],
        'fall': [9, 10, 11]
    }
    
    for season, months in seasons_months.items():
        for i in range(samples_per_season):
            # توليد تاريخ عشوائي في الفصل المحدد
            month = np.random.choice(months)
            
            # تحديد السنة (2024 أو 2025)
            if month == 12:
                year = 2024
            else:
                year = 2025 if month <= 10 else 2024
            
            day = np.random.randint(1, 29)  # تجنب مشاكل نهاية الشهر
            hour = np.random.randint(0, 24)
            
            timestamp = datetime.datetime(year, month, day, hour, 0, 0)
            is_weekend = timestamp.weekday() >= 5
            
            # توليد قيم واقعية
            pm25 = generate_realistic_pm25(
                base_openaq["pm25"], city_type, season, hour, is_weekend
            )
            
            no2_openaq = generate_realistic_no2(
                base_openaq["no2"], city_type, season, hour, is_weekend
            )
            
            tempo_no2 = generate_realistic_tempo_no2(season, city_type)
            
            # تنويع الطقس حسب الفصل
            if base_weather["temp"]:
                if season == 'winter':
                    temp = np.random.uniform(-10, 10)
                elif season == 'summer':
                    temp = np.random.uniform(20, 35)
                elif season == 'spring':
                    temp = np.random.uniform(10, 22)
                else:  # fall
                    temp = np.random.uniform(8, 20)
            else:
                temp = None
            
            wind = np.random.uniform(1, 15) if base_weather["wind"] else None
            
            record = {
                "city": city,
                "country": country,
                "lat": lat,
                "lon": lon,
                "date": timestamp.isoformat(),
                "season": season,
                
                "pm25": pm25,
                "no2_openaq": no2_openaq,
                "tempo_no2": tempo_no2,
                
                "temp": round(temp, 2) if temp else None,
                "wind": round(wind, 2) if wind else None,
            }
            
            # إضافة forecast
            for j, f in enumerate(base_weather["forecast"][:6], 1):
                record[f"f{j}_time"] = f["time"] if f["time"] else ""
                record[f"f{j}_temp"] = round(np.random.uniform(-5, 30), 2)
                record[f"f{j}_wind"] = round(np.random.uniform(1, 12), 2)
            
            records.append(record)
    
    # إضافة الأمثلة المتبقية (إذا كان العدد لا يقبل القسمة على 4)
    remaining = num_samples - len(records)
    for i in range(remaining):
        season = np.random.choice(list(seasons_months.keys()))
        months = seasons_months[season]
        month = np.random.choice(months)
        
        year = 2024 if month == 12 else 2025
        day = np.random.randint(1, 29)
        hour = np.random.randint(0, 24)
        
        timestamp = datetime.datetime(year, month, day, hour, 0, 0)
        is_weekend = timestamp.weekday() >= 5
        
        record = {
            "city": city,
            "country": country,
            "lat": lat,
            "lon": lon,
            "date": timestamp.isoformat(),
            "season": season,
            "pm25": generate_realistic_pm25(base_openaq["pm25"], city_type, season, hour, is_weekend),
            "no2_openaq": generate_realistic_no2(base_openaq["no2"], city_type, season, hour, is_weekend),
            "tempo_no2": generate_realistic_tempo_no2(season, city_type),
            "temp": round(np.random.uniform(-10, 35), 2),
            "wind": round(np.random.uniform(1, 15), 2),
        }
        
        for j in range(1, 7):
            record[f"f{j}_time"] = ""
            record[f"f{j}_temp"] = round(np.random.uniform(-5, 30), 2)
            record[f"f{j}_wind"] = round(np.random.uniform(1, 12), 2)
        
        records.append(record)
    
    return records

# ---------- مدن شمال أمريكا ----------
NORTH_AMERICA_CITIES = {
    # USA
    "New York, NY": (40.7128, -74.0060, "USA"),
    "Los Angeles, CA": (34.0522, -118.2437, "USA"),
    "Chicago, IL": (41.8781, -87.6298, "USA"),
    "Houston, TX": (29.7604, -95.3698, "USA"),
    "Phoenix, AZ": (33.4484, -112.0740, "USA"),
    "Philadelphia, PA": (39.9526, -75.1652, "USA"),
    "San Antonio, TX": (29.4241, -98.4936, "USA"),
    "San Diego, CA": (32.7157, -117.1611, "USA"),
    "Dallas, TX": (32.7767, -96.7970, "USA"),
    "San Jose, CA": (37.3382, -121.8863, "USA"),
    "Austin, TX": (30.2672, -97.7431, "USA"),
    "San Francisco, CA": (37.7749, -122.4194, "USA"),
    "Seattle, WA": (47.6062, -122.3321, "USA"),
    "Denver, CO": (39.7392, -104.9903, "USA"),
    "Washington, DC": (38.9072, -77.0369, "USA"),
    "Boston, MA": (42.3601, -71.0589, "USA"),
    "Portland, OR": (45.5152, -122.6784, "USA"),
    "Las Vegas, NV": (36.1699, -115.1398, "USA"),
    "Detroit, MI": (42.3314, -83.0458, "USA"),
    "Miami, FL": (25.7617, -80.1918, "USA"),
    
    # Canada
    "Toronto, ON": (43.6532, -79.3832, "Canada"),
    "Montreal, QC": (45.5017, -73.5673, "Canada"),
    "Vancouver, BC": (49.2827, -123.1207, "Canada"),
    "Calgary, AB": (51.0447, -114.0719, "Canada"),
    "Edmonton, AB": (53.5461, -113.4938, "Canada"),
    "Ottawa, ON": (45.4215, -75.6972, "Canada"),
    
    # Mexico
    "Mexico City": (19.4326, -99.1332, "Mexico"),
    "Guadalajara": (20.6597, -103.3496, "Mexico"),
    "Monterrey": (25.6866, -100.3161, "Mexico"),
    "Tijuana": (32.5149, -117.0382, "Mexico"),
}

# ---------- Dataset Builder ----------
def build_large_dataset(
    tempo_file=r"E:\NASA\air-forecast\data\TEMPO_sample.nc",
    out_file=r"E:\NASA\air-forecast\north_america_1000_diverse.csv",
    samples_per_city=32,
    api_delay=1.5
):
    """
    بناء dataset مع تنوع في الفصول وقيم NO2 واقعية
    30 مدينة × 32 مثال = 960 مثال
    """
    
    all_records = []
    total_cities = len(NORTH_AMERICA_CITIES)
    
    print(f"{'='*70}")
    print(f"🚀 بناء Dataset متنوع - شمال أمريكا")
    print(f"{'='*70}")
    print(f"🌍 عدد المدن: {total_cities}")
    print(f"📊 أمثلة لكل مدينة: {samples_per_city}")
    print(f"🎯 إجمالي متوقع: ~{total_cities * samples_per_city}")
    print(f"🌦️  تغطية: 4 فصول (Winter, Spring, Summer, Fall)")
    print(f"💨 قيم NO2: واقعية (5-80 µg/m³)")
    print(f"{'='*70}\n")
    
    for idx, (city, (lat, lon, country)) in enumerate(NORTH_AMERICA_CITIES.items(), 1):
        print(f"[{idx}/{total_cities}] 🌍 {city}, {country}")
        
        try:
            openaq = fetch_openaq(lat, lon)
            time.sleep(api_delay)
            
            weather = fetch_weather(lat, lon)
            time.sleep(api_delay)
            
            tempo_no2 = fetch_tempo(lat, lon, tempo_file)
            
            city_records = generate_multiple_samples(
                lat, lon, city, country,
                openaq, weather, tempo_no2,
                num_samples=samples_per_city
            )
            
            all_records.extend(city_records)
            
            # عرض إحصائيات سريعة
            df_city = pd.DataFrame(city_records)
            print(f"   ✅ {len(city_records)} مثال")
            print(f"   🌦️  الفصول: {df_city['season'].value_counts().to_dict()}")
            print(f"   💨 NO2: min={df_city['no2_openaq'].min():.1f}, max={df_city['no2_openaq'].max():.1f}, avg={df_city['no2_openaq'].mean():.1f}")
            print(f"   📈 إجمالي: {len(all_records)}\n")
            
        except Exception as e:
            print(f"   ❌ خطأ: {e}\n")
            continue
    
    df = pd.DataFrame(all_records)
    df.to_csv(out_file, index=False)
    
    print(f"\n{'='*70}")
    print(f"✅ تم بناء Dataset بنجاح!")
    print(f"{'='*70}")
    print(f"📁 الملف: {out_file}")
    print(f"📊 إجمالي الأمثلة: {len(df):,}")
    print(f"🌍 عدد المدن: {df['city'].nunique()}")
    print(f"\n🌦️  توزيع الفصول:")
    print(df['season'].value_counts())
    print(f"\n💨 إحصائيات NO2:")
    print(f"   Min: {df['no2_openaq'].min():.2f} µg/m³")
    print(f"   Max: {df['no2_openaq'].max():.2f} µg/m³")
    print(f"   Mean: {df['no2_openaq'].mean():.2f} µg/m³")
    print(f"   TEMPO NO2 Mean: {df['tempo_no2'].mean():.2e} molecules/cm²")
    print(f"\n🔢 توزيع حسب الدولة:")
    print(df['country'].value_counts())
    print(f"{'='*70}\n")
    
    return df

# ---------- تشغيل ----------
if __name__ == "__main__":
    df = build_large_dataset(samples_per_city=33)  # 30 مدن × 33 = 990 مثال
    
    print("📊 عينة من البيانات:")
    print(df[['city', 'season', 'no2_openaq', 'pm25', 'tempo_no2', 'temp']].head(15))