
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://habit-traker-ai.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

class HabitEntry(BaseModel):
    text: str
    date: str
    status: str

HABITS: List[HabitEntry] = []

@app.get("/habits", response_model=List[HabitEntry])
def get_habits():
    return HABITS

@app.post("/habits", status_code=204)
def add_habit(habit: HabitEntry):
    HABITS.append(habit)

@app.post("/habits/clear", status_code=204)
def clear_habits():
    HABITS.clear()

@app.get("/")
def health():
    return {"status": "ok"}
