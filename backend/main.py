from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from storage import load_data, save_data

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Habit Tracker Backend Running Successfully!"}

@app.get("/habits")
def get_habits():
    return load_data()

@app.post("/habits")
def add_habit(habit: dict):
    data = load_data()
    data.append(habit)
    save_data(data)
    return {"success": True, "habit_added": habit}

@app.post("/habits/clear")
def clear():
    save_data([])
    return {"success": True, "message": "All habits cleared!"}
