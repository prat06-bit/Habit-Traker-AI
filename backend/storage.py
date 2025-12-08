import json
import os

FILE_PATH = "habits.json"

def load_data():
    if not os.path.exists(FILE_PATH):
        return []
    with open(FILE_PATH, "r") as f:
        try:
            return json.load(f)
        except:
            return []

def save_data(data):
    with open(FILE_PATH, "w") as f:
        json.dump(data, f, indent=4)
