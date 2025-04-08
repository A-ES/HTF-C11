import requests
import json

API_KEY="in4H5aSM.Z3Ke56XWhf664t3YzPD9xok4iK977edZ"
URL = "https://payload.vextapp.com/hook/M044TZEBZT/catch/h"
headers={
    "Content-Type": "application/json",
    "Apikey": f"Api-Key {API_KEY}"

}
data = {"payload":"resources required to build 4 storey building"}
response = requests.post(URL, headers=headers, json=data)
print(response.text)