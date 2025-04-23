import os
import numpy as np
import cv2
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt

# Path to model
MODEL_PATH = "mri_brain_tumor_model-keras-default-v1/model.h5" 

# Path to some test images
TEST_IMAGES = [
    # Replace with paths to your known training images
    "path/to/known_meningioma.jpg",
    "path/to/known_glioma.jpg",
    "path/to/known_pituitary.jpg",
    "path/to/known_no_tumor.jpg"
]

# Class names
class_names = ["meningioma", "glioma", "pituitary", "no_tumor"]

# Load model
print(f"Loading model from {MODEL_PATH}")
model = keras.models.load_model(MODEL_PATH)
model.summary()

# Preprocess and predict for each test image
for img_path in TEST_IMAGES:
    print(f"\nTesting image: {img_path}")
    
    # Read image
    img = cv2.imread(img_path)
    if img is None:
        print(f"Could not read image at {img_path}")
        continue
    
    # Show original image
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    plt.title("Original Image")
    
    # Preprocess image
    resized = cv2.resize(img, (224, 224))
    rgb = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    normalized = rgb.astype(np.float32) / 255.0
    batch = np.expand_dims(normalized, axis=0)
    
    # Make prediction
    predictions = model.predict(batch)
    predicted_class = np.argmax(predictions[0])
    
    # Get class probabilities
    probs = predictions[0] * 100
    
    # Print results
    print(f"Predicted class: {class_names[predicted_class]}")
    for i, prob in enumerate(probs):
        print(f"  {class_names[i]}: {prob:.2f}%")
    
    # Show preprocessed image
    plt.subplot(1, 2, 2)
    plt.imshow(normalized)
    plt.title(f"Preprocessed → {class_names[predicted_class]} ({probs[predicted_class]:.1f}%)")
    
    plt.tight_layout()
    plt.savefig(f"test_result_{os.path.basename(img_path)}.png")

print("\nTest complete. Check saved images for results.")
