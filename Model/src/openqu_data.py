import requests

url = "https://api.openaq.org/v3/locations"

headers = {
    "X-API-Key": "PUT_YOUR_REAL_KEY_HERE"
}

params = {
    "country_id": "US",
    "city": "Washington",
    "limit": 5
}

response = requests.get(url, headers=headers, params=params)

print("Status:", response.status_code)
print(response.json())
