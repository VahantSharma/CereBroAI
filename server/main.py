import os
import uvicorn
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from app.routes import analysis
from app.database import init_db

# Load environment variables
load_dotenv(".env.fastapi")

# Create FastAPI app
app = FastAPI(
    title="CereBro AI ML Service",
    description="ML inference service for brain tumor detection",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, set this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directory if it doesn't exist
upload_dir = os.environ.get("UPLOAD_DIR", "uploads/mri-scans")
os.makedirs(upload_dir, exist_ok=True)

# Mount static files directory for serving uploaded images
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Include only the analysis router
app.include_router(analysis.router, prefix="/api/inference", tags=["Inference"])

@app.on_event("startup")
async def startup_db_client():
    await init_db()

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "CereBro AI ML Service is running"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 