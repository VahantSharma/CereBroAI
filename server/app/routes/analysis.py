import os
import shutil
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse
from typing import Dict, Optional
import logging

from app.utils.prediction import predict_image

router = APIRouter(tags=["inference"])

# Directory for storing uploaded files
UPLOAD_DIR = os.environ.get("UPLOAD_DIR", "uploads/temp")
os.makedirs(UPLOAD_DIR, exist_ok=True)

logger = logging.getLogger(__name__)

@router.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...)
):
    """
    ML inference endpoint - Analyze MRI scan image and return tumor detection results.
    This is a stateless endpoint that doesn't store results in a database.
    """
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="File has no filename")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image")
    
    # Generate unique ID and filename for temporary storage
    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    temp_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, temp_filename)
    
    try:
        # Save file to disk temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Run prediction
        prediction_result = predict_image(file_path)
        
        # Return prediction results
        return {
            "status": "success",
            "filename": file.filename,
            "result": prediction_result["result"],
            "confidence": prediction_result["confidence"],
            "class_probabilities": prediction_result["class_probabilities"]
        }
    
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing image: {str(e)}"
        )
    
    finally:
        # Close the file
        file.file.close()
        
        # Clean up temporary file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                logger.error(f"Error removing temporary file: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint for the ML inference service
    """
    return {"status": "ok", "message": "ML inference service is operational"} 