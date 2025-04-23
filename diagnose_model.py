import os
import h5py
import tensorflow as tf
import json

# Set environment variable to reduce TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# Print versions for diagnostic purposes
print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {tf.keras.__version__}")

# Path to your model
model_path = "mri_brain_tumor_model-keras-default-v1/model.h5"

# Check if the model file exists
if not os.path.exists(model_path):
    print(f"Error: Model file not found at {model_path}")
    exit(1)

print(f"\nAnalyzing model file: {model_path}")
print(f"File size: {os.path.getsize(model_path) / (1024*1024):.2f} MB")

# Examine the H5 file structure
try:
    with h5py.File(model_path, 'r') as f:
        print("\nH5 file structure:")
        def print_structure(name, obj):
            if isinstance(obj, h5py.Dataset):
                print(f"  Dataset: {name}, Shape: {obj.shape}, Type: {obj.dtype}")
            elif isinstance(obj, h5py.Group):
                print(f"  Group: {name}")
                
        f.visititems(print_structure)
        
        # Check for model_config attribute
        if 'model_config' in f.attrs:
            model_config = f.attrs['model_config']
            if isinstance(model_config, bytes):
                model_config = model_config.decode('utf-8')
                
            print("\nModel configuration found!")
            config = json.loads(model_config)
            print(f"  Model class name: {config.get('class_name', 'Not found')}")
            print(f"  Keras version: {config.get('keras_version', 'Not found')}")
            
            # Check for problematic attributes
            if 'batch_shape' in str(model_config):
                print("\nPotential issue detected: 'batch_shape' found in model config")
                print("This attribute may not be compatible with your current TensorFlow version")
        else:
            print("\nNo model_config attribute found in the file.")
            
except Exception as e:
    print(f"Error examining H5 file: {str(e)}")

# Attempt to load the model in various ways
print("\nAttempting to load model...")

# Method 1: Standard loading
try:
    print("\nMethod 1: Standard loading")
    model = tf.keras.models.load_model(model_path)
    print("  Success! Model loaded with standard method")
    print(f"  Model type: {type(model)}")
    print(f"  Input shape: {model.input_shape}")
    print(f"  Output shape: {model.output_shape}")
    model.summary()
except Exception as e:
    print(f"  Failed: {str(e)}")

# Method 2: Loading with compile=False
try:
    print("\nMethod 2: Loading with compile=False")
    model = tf.keras.models.load_model(model_path, compile=False)
    print("  Success! Model loaded with compile=False")
    model.summary()
except Exception as e:
    print(f"  Failed: {str(e)}")

# Method 3: Load weights only
try:
    print("\nMethod 3: Creating a simple model and loading weights")
    # Create a simple Sequential model
    dummy_model = tf.keras.Sequential([
        tf.keras.layers.InputLayer(input_shape=(224, 224, 3)),
        tf.keras.layers.Conv2D(32, kernel_size=3, activation='relu'),
        tf.keras.layers.MaxPooling2D(),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dense(4, activation='softmax')
    ])
    
    # Try to load weights
    try:
        dummy_model.load_weights(model_path)
        print("  Success! Weights loaded into dummy model")
    except Exception as e:
        print(f"  Failed to load weights: {str(e)}")
        
    # Try alternative approach for loading weights
    try:
        with h5py.File(model_path, 'r') as f:
            weight_names = [name for name in f.keys() if 'weight' in name.lower()]
            print(f"  Found {len(weight_names)} weight-related keys in the H5 file")
    except Exception as e:
        print(f"  Failed to enumerate weights: {str(e)}")
    
except Exception as e:
    print(f"  Failed: {str(e)}")

print("\nDiagnosis complete. Check the results above for compatible loading methods.")
