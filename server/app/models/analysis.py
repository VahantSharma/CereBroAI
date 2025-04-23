from datetime import datetime
from typing import Dict, Optional
from sqlalchemy import Column, String, DateTime, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.schemas.analysis import AnalysisStatus, TumorType


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    original_filename = Column(String, nullable=False)
    image_path = Column(String, nullable=False)
    status = Column(String, nullable=False, default=AnalysisStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    note = Column(Text, nullable=True)
    
    # Results
    result = Column(String, nullable=True)  # TumorType
    confidence = Column(Float, nullable=True)
    class_probabilities = Column(JSON, nullable=True)  # Dict storing all class probabilities
    message = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="analyses") 