from enum import Enum
from datetime import datetime
from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field
from bson import ObjectId
from app.schemas.user import PyObjectId
from uuid import UUID

class TumorType(str, Enum):
    NO_TUMOR = "no_tumor"
    MENINGIOMA = "meningioma"
    GLIOMA = "glioma"
    PITUITARY = "pituitary"

class AnalysisStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class AnalysisBase(BaseModel):
    id: str
    user_id: str
    status: AnalysisStatus
    original_filename: str
    created_at: datetime
    updated_at: datetime
    note: Optional[str] = None

class AnalysisCreate(BaseModel):
    """Schema for creating a new analysis"""
    user_id: UUID
    note: Optional[str] = None

class AnalysisUpdate(BaseModel):
    """Schema for updating an analysis"""
    note: Optional[str] = None

class PredictionResult(BaseModel):
    """Schema for ML prediction results"""
    class_name: str
    confidence: float
    probabilities: Dict[str, float]

class AnalysisResponse(BaseModel):
    """Schema for an analysis response"""
    id: UUID
    user_id: UUID
    image_path: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    note: Optional[str] = None
    result: Optional[PredictionResult] = None

    class Config:
        orm_mode = True

class AnalysisListResponse(BaseModel):
    """Schema for a list of analyses"""
    items: List[AnalysisResponse]
    total: int
    page: int
    size: int

class AnalysisInDB(AnalysisBase):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Analysis(AnalysisBase):
    id: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class AnalysisResponse(AnalysisBase):
    message: str = ""
    result: Optional[TumorType] = None
    confidence: Optional[float] = None
    class_probabilities: Optional[Dict[str, float]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "user_id": "user123",
                "status": "completed",
                "message": "Analysis completed successfully",
                "original_filename": "brain_mri.jpg",
                "created_at": "2023-04-01T12:00:00",
                "updated_at": "2023-04-01T12:05:00",
                "note": "Patient with headaches",
                "result": "glioma",
                "confidence": 0.92,
                "class_probabilities": {
                    "no_tumor": 0.02,
                    "meningioma": 0.03,
                    "glioma": 0.92,
                    "pituitary": 0.03
                }
            }
        } 