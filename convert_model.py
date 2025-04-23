import tensorflow as tf
import os

# Path to your model
original_model_path = "mri_brain_tumor_model-keras-default-v1/model.h5"
new_model_path = "mri_brain_tumor_model-keras-default-v1/model_converted.h5"

# Load and immediately save the model with the current TensorFlow version
try:
    # Try to load with standard loading
    model = tf.keras.models.load_model(original_model_path, compile=False)
    
    # Print model summary
    model.summary()
    
    # Save the model in the current format
    model.save(new_model_path)
    print(f"Model successfully converted and saved to {new_model_path}")
except Exception as e:
    print(f"Error converting model: {e}")
    
    # Advanced loading attempt
    try:
        print("Attempting advanced loading...")
        # Try with custom objects
        from tensorflow.keras.models import model_from_json
        
        # Extract architecture and weights separately
        with tf.io.gfile.GFile(original_model_path, 'rb') as f:
            model_content = f.read()
        
        import h5py
        with h5py.File(original_model_path, 'r') as f:
            if 'model_config' in f.attrs:
                # Get the model architecture
                model_config = f.attrs['model_config']
                
                # Create model from config
                from tensorflow.keras.models import model_from_json
                model = model_from_json(model_config.decode('utf-8'))
                
                # Load weights
                model.load_weights(original_model_path)
                
                # Save in the current format
                model.save(new_model_path)
                print(f"Model successfully converted using advanced method and saved to {new_model_path}")
            else:
                print("Could not extract model architecture from H5 file")
    except Exception as e2:
        print(f"Advanced conversion failed: {e2}")
