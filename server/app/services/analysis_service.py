import os
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisCreate, AnalysisResponse, AnalysisStatus, TumorType
from app.services.ml_service import MLService


class AnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.ml_service = MLService()

    def create_analysis(self, user_id: str, note: Optional[str] = None) -> Analysis:
        """
        Create a new analysis entry in the database
        """
        analysis_id = str(uuid.uuid4())
        db_analysis = Analysis(
            id=analysis_id,
            user_id=user_id,
            note=note,
            status="pending",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        self.db.add(db_analysis)
        self.db.commit()
        self.db.refresh(db_analysis)
        
        return db_analysis
    
    def process_analysis(self, analysis_id: str, image_path: str) -> AnalysisResponse:
        """
        Process an MRI scan using the ML service and update the analysis
        """
        # Get the analysis from the database
        db_analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        
        if not db_analysis:
            raise ValueError(f"Analysis with ID {analysis_id} not found")
        
        # Use ML service to analyze the image
        result = self.ml_service.analyze_image(image_path)
        
        # Update analysis with results
        db_analysis.result = result["class_name"]
        db_analysis.confidence = result["confidence"]
        db_analysis.probabilities = result["probabilities"]
        db_analysis.status = "completed"
        db_analysis.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_analysis)
        
        # Convert to response model
        return self._to_response(db_analysis, image_path)
    
    def get_analysis_by_id(self, analysis_id: str) -> Optional[AnalysisResponse]:
        """
        Get an analysis by ID
        """
        db_analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        
        if not db_analysis:
            return None
            
        image_path = os.path.join(os.getenv("UPLOAD_DIR", "uploads"), f"{analysis_id}.jpg")
        
        return self._to_response(db_analysis, image_path)
    
    def get_analyses_by_user(self, user_id: str, skip: int = 0, limit: int = 100) -> List[AnalysisResponse]:
        """
        Get all analyses for a user
        """
        analyses = self.db.query(Analysis).filter(
            Analysis.user_id == user_id
        ).order_by(
            Analysis.created_at.desc()
        ).offset(skip).limit(limit).all()
        
        return [self._to_response(analysis, os.path.join(os.getenv("UPLOAD_DIR", "uploads"), f"{analysis.id}.jpg")) 
                for analysis in analyses]
    
    def update_analysis_note(self, analysis_id: str, note: str) -> AnalysisResponse:
        """
        Update the note for an analysis
        """
        db_analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        
        if not db_analysis:
            raise ValueError(f"Analysis with ID {analysis_id} not found")
        
        db_analysis.note = note
        db_analysis.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(db_analysis)
        
        image_path = os.path.join(os.getenv("UPLOAD_DIR", "uploads"), f"{analysis_id}.jpg")
        
        return self._to_response(db_analysis, image_path)
    
    def delete_analysis(self, analysis_id: str) -> None:
        """
        Delete an analysis
        """
        db_analysis = self.db.query(Analysis).filter(Analysis.id == analysis_id).first()
        
        if not db_analysis:
            raise ValueError(f"Analysis with ID {analysis_id} not found")
        
        # Delete the associated image file
        image_path = os.path.join(os.getenv("UPLOAD_DIR", "uploads"), f"{analysis_id}.jpg")
        if os.path.exists(image_path):
            os.remove(image_path)
        
        self.db.delete(db_analysis)
        self.db.commit()
    
    def _to_response(self, db_analysis: Analysis, image_path: str) -> AnalysisResponse:
        """
        Convert a database Analysis model to an AnalysisResponse schema
        """
        image_url = f"/uploads/{db_analysis.id}.jpg"  # URL path for the frontend
        
        return AnalysisResponse(
            id=db_analysis.id,
            user_id=db_analysis.user_id,
            note=db_analysis.note,
            status=db_analysis.status,
            result=db_analysis.result,
            confidence=db_analysis.confidence,
            probabilities=db_analysis.probabilities,
            image_url=image_url,
            created_at=db_analysis.created_at,
            updated_at=db_analysis.updated_at
        ) 