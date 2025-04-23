from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import JSONResponse
from typing import List, Optional
from uuid import UUID, uuid4
import os
import shutil
from datetime import datetime

from app.schemas.analysis import (
    AnalysisCreate, 
    AnalysisUpdate, 
    AnalysisResponse, 
    AnalysisListResponse,
    AnalysisStatus,
    PredictionResult
)
from app.services.ml_service import MLService
from app.database.repositories.analysis_repository import AnalysisRepository
from app.database.database import get_db

router = APIRouter(prefix="/analysis", tags=["analysis"])

# Initialize ML service
ml_service = MLService()

@router.post("/", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    image: UploadFile = File(...),
    user_id: UUID = Form(...),
    note: Optional[str] = Form(None),
    db = Depends(get_db)
):
    """
    Upload an MRI scan image and create a new analysis
    """
    # Check if the file is an image
    if not image.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File uploaded is not an image"
        )
    
    # Create a unique ID for this analysis
    analysis_id = uuid4()
    
    # Create directory for uploads if it doesn't exist
    upload_dir = os.path.join("uploads", str(user_id))
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save the uploaded file
    filename = f"{analysis_id}_{image.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    
    # Create analysis record in database
    analysis_repo = AnalysisRepository(db)
    analysis_data = {
        "id": str(analysis_id),
        "user_id": str(user_id),
        "status": AnalysisStatus.PROCESSING,
        "original_filename": image.filename,
        "image_path": file_path,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "note": note
    }
    
    # Create the analysis in database
    analysis = analysis_repo.create_analysis(analysis_data)
    
    # Process the image with ML model
    try:
        result = ml_service.analyze_image(file_path)
        
        # Update analysis with results
        prediction_result = PredictionResult(
            class_name=result["class_name"],
            confidence=result["confidence"],
            probabilities=result["probabilities"]
        )
        
        update_data = {
            "status": AnalysisStatus.COMPLETED,
            "result": prediction_result.dict(),
            "updated_at": datetime.utcnow()
        }
        
        updated_analysis = analysis_repo.update_analysis(str(analysis_id), update_data)
        return updated_analysis
        
    except Exception as e:
        # Update analysis status to failed
        update_data = {
            "status": AnalysisStatus.FAILED,
            "message": f"Analysis failed: {str(e)}",
            "updated_at": datetime.utcnow()
        }
        
        analysis_repo.update_analysis(str(analysis_id), update_data)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing image: {str(e)}"
        )

@router.get("/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(
    analysis_id: UUID,
    db = Depends(get_db)
):
    """
    Get a specific analysis by ID
    """
    analysis_repo = AnalysisRepository(db)
    analysis = analysis_repo.get_analysis(str(analysis_id))
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis

@router.get("/", response_model=AnalysisListResponse)
async def list_analyses(
    user_id: Optional[UUID] = None,
    page: int = 1,
    size: int = 10,
    db = Depends(get_db)
):
    """
    List analyses with optional filtering by user_id
    """
    analysis_repo = AnalysisRepository(db)
    
    # Convert UUID to string if it's provided
    user_id_str = str(user_id) if user_id else None
    
    analyses, total = analysis_repo.list_analyses(
        user_id=user_id_str,
        page=page,
        size=size
    )
    
    return {
        "items": analyses,
        "total": total,
        "page": page,
        "size": size
    }

@router.patch("/{analysis_id}", response_model=AnalysisResponse)
async def update_analysis(
    analysis_id: UUID,
    analysis_update: AnalysisUpdate,
    db = Depends(get_db)
):
    """
    Update an analysis (note field only)
    """
    analysis_repo = AnalysisRepository(db)
    analysis = analysis_repo.get_analysis(str(analysis_id))
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    update_data = {
        "note": analysis_update.note,
        "updated_at": datetime.utcnow()
    }
    
    updated_analysis = analysis_repo.update_analysis(
        str(analysis_id),
        update_data
    )
    
    return updated_analysis

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: UUID,
    db = Depends(get_db)
):
    """
    Delete an analysis
    """
    analysis_repo = AnalysisRepository(db)
    analysis = analysis_repo.get_analysis(str(analysis_id))
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Delete the associated image file if it exists
    if analysis.get("image_path") and os.path.exists(analysis["image_path"]):
        try:
            os.remove(analysis["image_path"])
        except Exception as e:
            # Log error but continue with deletion
            print(f"Error deleting file: {str(e)}")
    
    # Delete the analysis from database
    analysis_repo.delete_analysis(str(analysis_id))
    
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={}) 