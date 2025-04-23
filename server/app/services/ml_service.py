import os
import json
import numpy as np
from PIL import Image
import torch
from torchvision import transforms
from typing import Dict, Any, List, Tuple
import tensorflow as tf
import logging
from app.schemas.analysis import TumorType

logger = logging.getLogger(__name__)

class MLService:
    """Service for handling machine learning model operations"""
    
    def __init__(self):
        """Initialize the ML service and load the model"""
        self.model = None
        self.model_path = os.environ.get('MODEL_PATH', 'models/brain_tumor_classifier.h5')
        self.image_size = (224, 224)  # Standard input size for many CNN models
        self.class_mapping = {
            0: TumorType.NO_TUMOR,
            1: TumorType.MENINGIOMA,
            2: TumorType.GLIOMA,
            3: TumorType.PITUITARY
        }
        self._load_model()
    
    def _load_model(self) -> None:
        """Load the TensorFlow model"""
        try:
            if os.path.exists(self.model_path):
                logger.info(f"Loading model from {self.model_path}")
                self.model = tf.keras.models.load_model(self.model_path)
                logger.info("Model loaded successfully")
            else:
                logger.error(f"Model file not found at {self.model_path}")
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            raise Exception(f"Failed to load model: {str(e)}")
    
    def _preprocess_image(self, image_path: str) -> np.ndarray:
        """
        Preprocess the image for model input
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Preprocessed image as numpy array
        """
        try:
            img = Image.open(image_path)
            img = img.resize(self.image_size)
            img = img.convert('RGB')  # Ensure 3 channels
            
            # Convert to numpy array and normalize
            img_array = np.array(img) / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise Exception(f"Failed to preprocess image: {str(e)}")
    
    def analyze_image(self, image_path: str) -> Dict[str, Any]:
        """
        Analyze an MRI image for tumor detection
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Dictionary with prediction results
        """
        if not self.model:
            self._load_model()
        
        try:
            # Preprocess the image
            processed_image = self._preprocess_image(image_path)
            
            # Run inference
            predictions = self.model.predict(processed_image)[0]
            
            # Get the predicted class
            predicted_class_idx = np.argmax(predictions)
            predicted_class = self.class_mapping[predicted_class_idx]
            confidence = float(predictions[predicted_class_idx])
            
            # Format probabilities as a list of dictionaries
            probabilities = [
                {"class": self.class_mapping[i], "probability": float(prob)}
                for i, prob in enumerate(predictions)
            ]
            
            return {
                "class_name": predicted_class,
                "confidence": confidence,
                "probabilities": probabilities
            }
            
        except Exception as e:
            logger.error(f"Error during image analysis: {str(e)}")
            raise Exception(f"Failed to analyze image: {str(e)}")

    def _load_model(self):
        """
        Load the pre-trained PyTorch model
        """
        # Path to the model file (adjust as needed)
        model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                                 "models", "brain_tumor_model.pth")
        
        # Check if model exists
        if not os.path.exists(model_path):
            # For testing purposes, return a dummy model
            print(f"Warning: Model not found at {model_path}. Using dummy model.")
            return None
        
        # Load the model
        model = torch.load(model_path, map_location=self.device)
        model.eval()
        return model
    
    def _get_transforms(self):
        """
        Define image transformations for the model
        """
        return transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                                std=[0.229, 0.224, 0.225])
        ])
    
    def _generate_dummy_prediction(self) -> Dict[str, Any]:
        """
        Generate a dummy prediction for testing when no model is available
        """
        # Generate random probabilities
        probs = np.random.dirichlet(np.ones(len(self.class_names))).tolist()
        pred_idx = np.argmax(probs)
        
        return {
            "class_name": self.class_names[pred_idx],
            "confidence": float(probs[pred_idx]),
            "probabilities": {
                class_name: float(prob) 
                for class_name, prob in zip(self.class_names, probs)
            }
        } 