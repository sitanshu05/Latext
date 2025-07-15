from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Message(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}

@app.post("/echo")
def echo(data: Message):
    return {"echo": data.message}
