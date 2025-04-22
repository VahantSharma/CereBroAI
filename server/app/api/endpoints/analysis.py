import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.schemas.analysis import AnalysisCreate, AnalysisResponse, AnalysisUpdate
from app.schemas.user import User
from app.services.analysis_service import AnalysisService
from app.services.ml_service import MLService

router = APIRouter()
ml_service = MLService()

@router.post("/", response_model=AnalysisResponse, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    file: UploadFile = File(...),
    note: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new brain MRI scan analysis
    """
    # Check if the file is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="File provided is not an image"
        )
    
    # Create uploads directory if it doesn't exist
    uploads_dir = os.path.join(settings.UPLOAD_DIR)
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate a unique filename
    analysis_service = AnalysisService(db)
    analysis = analysis_service.create_analysis(
        user_id=current_user.id,
        note=note
    )
    
    # Save the file
    file_location = os.path.join(uploads_dir, f"{analysis.id}.jpg")
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Process the analysis
    try:
        processed_analysis = analysis_service.process_analysis(analysis.id, file_location)
        return processed_analysis
    except Exception as e:
        # Cleanup in case of error
        if os.path.exists(file_location):
            os.remove(file_location)
        analysis_service.delete_analysis(analysis.id)
        raise HTTPException(
            status_code=500,
            detail=f"Error processing analysis: {str(e)}"
        )

@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific analysis by ID
    """
    analysis_service = AnalysisService(db)
    analysis = analysis_service.get_analysis_by_id(analysis_id)
    
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )
    
    # Check if the user owns this analysis
    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to access this analysis"
        )
    
    return analysis

@router.get("/", response_model=List[AnalysisResponse])
def get_user_analyses(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve all analyses for the current user
    """
    analysis_service = AnalysisService(db)
    analyses = analysis_service.get_analyses_by_user(
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )
    return analyses

@router.patch("/{analysis_id}", response_model=AnalysisResponse)
def update_analysis(
    analysis_id: str,
    analysis_update: AnalysisUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an analysis note
    """
    analysis_service = AnalysisService(db)
    analysis = analysis_service.get_analysis_by_id(analysis_id)
    
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )
    
    # Check if the user owns this analysis
    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this analysis"
        )
    
    updated_analysis = analysis_service.update_analysis_note(
        analysis_id=analysis_id,
        note=analysis_update.note
    )
    
    return updated_analysis

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_analysis(
    analysis_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an analysis
    """
    analysis_service = AnalysisService(db)
    analysis = analysis_service.get_analysis_by_id(analysis_id)
    
    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )
    
    # Check if the user owns this analysis
    if analysis.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this analysis"
        )
    
    analysis_service.delete_analysis(analysis_id)
    
    return None 