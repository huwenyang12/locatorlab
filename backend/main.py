from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from backend.ai_locator import generate_locators

app = FastAPI()
INDEX_HTML = Path(__file__).resolve().parent.parent / "index.html"
BASE_DIR = Path(__file__).resolve().parent.parent

class LocatorRequest(BaseModel):
    target: dict
    html: str

@app.get("/favicon.png", include_in_schema=False)
async def favicon():
    return FileResponse(BASE_DIR / "favicon.png", media_type="image/png")

@app.get("/")
def home():
    return FileResponse(INDEX_HTML)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/ai-locator")
def ai_locator(request: LocatorRequest):
    return {"candidates": generate_locators(request.model_dump())}