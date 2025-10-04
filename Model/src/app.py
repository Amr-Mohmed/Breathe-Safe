"""
FastAPI خفيف وسريع جداً
استخدم هذا الملف بدلاً من app.py إذا كنت تريد سرعة أعلى
"""

import torch
import torch.nn as nn
from fastapi import FastAPI, Response
from fastapi.responses import ORJSONResponse
import orjson
import numpy as np

# ============================================
# LSTM Model
# ============================================

class LSTMModel(nn.Module):
    def __init__(self, input_size, hidden_size=50):
        super().__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, 1)
    
    def forward(self, x):
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :])


# ============================================
# تحميل الموديل مرة واحدة
# ============================================

print("Loading model...")
model = LSTMModel(5, 50)
model.load_state_dict(torch.load(
    r"E:\NASA\AIR-quality-forecast\Model\lstm_aqi_model.pth",
    map_location="cpu",
    weights_only=True
))
model.eval()
torch.set_num_threads(1)
print("✅ Model ready!")


# ============================================
# FastAPI (minimal)
# ============================================

app = FastAPI(
    default_response_class=ORJSONResponse,  # أسرع من JSON العادي
    docs_url="/docs",
    redoc_url=None,
    openapi_url="/openapi.json"
)


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(features: list[list[float]]):
    """
    Input: [[day1_5features], [day2], ..., [day7]]
    Output: {"aqi": float}
    """
    try:
        if len(features) != 7 or len(features[0]) != 5:
            return {"error": "Invalid input shape"}
        
        x = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            pred = model(x).item()
        
        return {"aqi": round(pred, 2)}
    
    except Exception as e:
        return {"error": str(e)}


# ============================================
# Body بدون Pydantic (أسرع)
# ============================================

@app.post("/predict-fast")
async def predict_fast(request: dict):
    """
    أسرع endpoint - بدون validation
    """
    try:
        features = request.get("features", [])
        x = torch.tensor(features, dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            pred = model(x).item()
        
        return {"aqi": round(pred, 2)}
    except:
        return {"error": "prediction failed"}


# ============================================
# تشغيل
# ============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="critical",
        access_log=False
    )