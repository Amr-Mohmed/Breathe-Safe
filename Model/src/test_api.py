import requests
import json

# ============================================
# اختبار API
# ============================================

API_URL = "http://127.0.0.1:8000"

def test_health():
    """اختبار Health Check"""
    print("\n" + "="*50)
    print("Testing Health Check...")
    print("="*50)
    
    response = requests.get(f"{API_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_prediction_method1():
    """اختبار التنبؤ - الطريقة الأولى (structured data)"""
    print("\n" + "="*50)
    print("Testing Prediction - Method 1 (Structured)")
    print("="*50)
    
    data = {
        "last_7_days": [
            {"days_co": 0.45, "days_no2": 0.32, "days_ozone": 0.51, "days_pm25": 0.68, "days_pm10": 0.74},
            {"days_co": 0.52, "days_no2": 0.38, "days_ozone": 0.48, "days_pm25": 0.71, "days_pm10": 0.79},
            {"days_co": 0.48, "days_no2": 0.35, "days_ozone": 0.53, "days_pm25": 0.65, "days_pm10": 0.72},
            {"days_co": 0.55, "days_no2": 0.41, "days_ozone": 0.49, "days_pm25": 0.73, "days_pm10": 0.81},
            {"days_co": 0.51, "days_no2": 0.37, "days_ozone": 0.52, "days_pm25": 0.69, "days_pm10": 0.76},
            {"days_co": 0.58, "days_no2": 0.44, "days_ozone": 0.47, "days_pm25": 0.75, "days_pm10": 0.83},
            {"days_co": 0.53, "days_no2": 0.39, "days_ozone": 0.54, "days_pm25": 0.71, "days_pm10": 0.78}
        ]
    }
    
    response = requests.post(f"{API_URL}/predict", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_prediction_method2():
    """اختبار التنبؤ - الطريقة الثانية (simple array)"""
    print("\n" + "="*50)
    print("Testing Prediction - Method 2 (Simple Array)")
    print("="*50)
    
    data = {
        "features": [
            [0.45, 0.32, 0.51, 0.68, 0.74],
            [0.52, 0.38, 0.48, 0.71, 0.79],
            [0.48, 0.35, 0.53, 0.65, 0.72],
            [0.55, 0.41, 0.49, 0.73, 0.81],
            [0.51, 0.37, 0.52, 0.69, 0.76],
            [0.58, 0.44, 0.47, 0.75, 0.83],
            [0.53, 0.39, 0.54, 0.71, 0.78]
        ]
    }
    
    response = requests.post(f"{API_URL}/predict-simple", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_error_handling():
    """اختبار معالجة الأخطاء"""
    print("\n" + "="*50)
    print("Testing Error Handling (Less than 7 days)")
    print("="*50)
    
    # إرسال 5 أيام فقط (يجب أن يفشل)
    data = {
        "features": [
            [0.45, 0.32, 0.51, 0.68, 0.74],
            [0.52, 0.38, 0.48, 0.71, 0.79],
            [0.48, 0.35, 0.53, 0.65, 0.72],
            [0.55, 0.41, 0.49, 0.73, 0.81],
            [0.51, 0.37, 0.52, 0.69, 0.76]
        ]
    }
    
    response = requests.post(f"{API_URL}/predict-simple", json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


# ============================================
# مثال استخدام من Database
# ============================================

def example_from_database():
    """
    مثال: كيف تجلب البيانات من Database وتستخدمها
    """
    print("\n" + "="*50)
    print("Example: Fetching from Database")
    print("="*50)
    
    # مثال: جلب من Database (افتراضي)
    # في الواقع ستستخدم SQLAlchemy أو Django ORM
    
    # افترض أن هذه البيانات جاءت من Database
    db_records = [
        {"date": "2025-01-20", "days_co": 45.2, "days_no2": 32.1, "days_ozone": 51.3, "days_pm25": 68.5, "days_pm10": 74.2},
        {"date": "2025-01-21", "days_co": 52.8, "days_no2": 38.4, "days_ozone": 48.7, "days_pm25": 71.9, "days_pm10": 79.1},
        {"date": "2025-01-22", "days_co": 48.5, "days_no2": 35.2, "days_ozone": 53.1, "days_pm25": 65.3, "days_pm10": 72.4},
        {"date": "2025-01-23", "days_co": 55.3, "days_no2": 41.7, "days_ozone": 49.2, "days_pm25": 73.8, "days_pm10": 81.5},
        {"date": "2025-01-24", "days_co": 51.1, "days_no2": 37.9, "days_ozone": 52.4, "days_pm25": 69.2, "days_pm10": 76.8},
        {"date": "2025-01-25", "days_co": 58.7, "days_no2": 44.3, "days_ozone": 47.8, "days_pm25": 75.4, "days_pm10": 83.2},
        {"date": "2025-01-26", "days_co": 53.4, "days_no2": 39.6, "days_ozone": 54.2, "days_pm25": 71.1, "days_pm10": 78.9}
    ]
    
    # تطبيع البيانات (Normalization)
    # يجب استخدام نفس المعاملات المستخدمة في التدريب!
    from sklearn.preprocessing import MinMaxScaler
    import pandas as pd
    
    df = pd.DataFrame(db_records)
    feature_cols = ['days_co', 'days_no2', 'days_ozone', 'days_pm25', 'days_pm10']
    
    # هنا يجب استخدام الـ scaler المحفوظ من التدريب
    # لكن للتبسيط سنستخدم MinMaxScaler جديد
    scaler = MinMaxScaler()
    df[feature_cols] = scaler.fit_transform(df[feature_cols])
    
    # تحويل للفورمات المطلوب
    features = df[feature_cols].values.tolist()
    
    # إرسال للـ API
    data = {"features": features}
    response = requests.post(f"{API_URL}/predict-simple", json=data)
    
    print(f"✅ Prediction from DB data:")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


# ============================================
# تشغيل كل الاختبارات
# ============================================

if __name__ == "__main__":
    try:
        print("\n🚀 Starting API Tests...")
        
        test_health()
        test_prediction_method1()
        test_prediction_method2()
        test_error_handling()
        example_from_database()
        
        print("\n" + "="*50)
        print("✅ All tests completed!")
        print("="*50)
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to API")
        print("Make sure FastAPI server is running:")
        print("  cd E:\\NASA\\AIR-quality-forecast\\src")
        print("  uvicorn app:app --reload")
    except Exception as e:
        print(f"\n❌ Error: {e}")