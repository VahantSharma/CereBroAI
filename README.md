# CereBro AI - Brain Tumor Detection System

A comprehensive web application for detecting and classifying brain tumors from MRI scans using deep learning.

## System Architecture

The system follows a microservice architecture with three main components:

1. **Frontend (React/TypeScript)**: User interface for uploading MRI scans, viewing results, and managing user data.
2. **Backend API (Node.js/Express)**: Main API server handling authentication, user management, and analysis storage.
3. **ML Service (Python/FastAPI)**: Specialized microservice for ML inference that processes MRI images and returns tumor detection results.

### Architectural Diagram

```
+-------------------+      +--------------------+      +--------------------+
|                   |      |                    |      |                    |
|  React Frontend   |----->|  Node.js Backend   |----->|  Python ML Service |
|                   |      |                    |      |                    |
+-------------------+      +--------------------+      +--------------------+
        ^                          |
        |                          v
        |                  +-------------------+
        +------------------|    MongoDB        |
                           +-------------------+
```

## Setup Instructions

### Prerequisites

- Node.js (v14+) and npm
- Python 3.8+ and pip
- MongoDB database (local or Atlas)

### ML Service Setup (Python/FastAPI)

1. Navigate to the server directory:

   ```
   cd server
   ```

2. Install Python dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Configure environment variables by editing `.env.fastapi` file:

   - Set `MODEL_PATH` to the location of your model file
   - Set `PORT` to the desired port (default: 6000)

4. Start the ML Service:
   ```
   python main.py
   ```

### Backend API Setup (Node.js/Express)

1. Navigate to the server directory:

   ```
   cd server
   ```

2. Install Node.js dependencies:

   ```
   npm install
   ```

3. Configure environment variables by editing `.env` file:

   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` and other security settings
   - Ensure `ML_SERVICE_URL` points to your running ML Service

4. Start the Node.js server:
   ```
   npm run dev
   ```

### Frontend Setup (React/TypeScript)

1. Navigate to the frontend directory:

   ```
   cd cortex-view-app-main
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Model Information

The system uses a deep learning model trained on MRI brain scans to detect and classify four categories:

1. **Meningioma**: A tumor that grows in the membranes that cover the brain and spinal cord
2. **Glioma**: Tumors that grow in the brain or spinal cord, starting in the glial cells
3. **Pituitary**: Tumors that affect the pituitary gland
4. **No Tumor**: Normal brain tissue without abnormal cell growth

## License

This project is licensed under the MIT License - see the LICENSE file for details.
