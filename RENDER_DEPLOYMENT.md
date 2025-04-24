# Deploying CereBro AI on Render.com

This guide explains how to deploy the entire CereBro AI application (Frontend, Backend, and ML Service) on Render.com.

## Prerequisites

1. Create a Render.com account: https://render.com/
2. Connect your GitHub repository to Render

## Deployment Options

You have two options for deployment:

### Option 1: Using Blueprint (Recommended)

1. Go to your Render dashboard and click "New" > "Blueprint"
2. Select the GitHub repository containing your code
3. Render will detect the `render.yaml` file and create all three services automatically
4. Set the required environment variables (see below)
5. Click "Apply"

### Option 2: Manual Deployment

If you prefer to set up each service manually:

#### 1. Deploy the ML Service (FastAPI)

1. Go to your Render dashboard and click "New" > "Web Service"
2. Connect to your GitHub repository
3. Fill in the following details:
   - Name: cerebro-ai-ml-service
   - Root Directory: server
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Set the environment variables:
   - PORT: 10000
   - MODEL_PATH: ../mri_brain_tumor_model-keras-default-v1/model.h5
   - UPLOAD_DIR: uploads/mri-scans
5. Click "Create Web Service"

#### 2. Deploy the Backend (Node.js)

1. Go to your Render dashboard and click "New" > "Web Service"
2. Connect to your GitHub repository
3. Fill in the following details:
   - Name: cerebro-ai-backend
   - Root Directory: server
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Set the environment variables:
   - NODE_ENV: production
   - PORT: 10000
   - MONGODB_URI: (your MongoDB connection string)
   - JWT_SECRET: (your JWT secret)
   - ML_SERVICE_URL: https://cerebro-ai-ml-service.onrender.com
5. Click "Create Web Service"

#### 3. Deploy the Frontend (React)

1. Go to your Render dashboard and click "New" > "Static Site"
2. Connect to your GitHub repository
3. Fill in the following details:
   - Name: cerebro-ai-frontend
   - Root Directory: cortex-view-app-main
   - Build Command: `./build.sh`
   - Publish Directory: dist
4. Add environment variable:
   - VITE_API_URL: https://cerebro-ai-backend.onrender.com
5. Under Advanced, add a redirect/rewrite rule:
   - Source: /\*
   - Destination: /index.html
6. Click "Create Static Site"

## Required Environment Variables

### ML Service

- PORT: 10000
- MODEL_PATH: ../mri_brain_tumor_model-keras-default-v1/model.h5
- UPLOAD_DIR: uploads/mri-scans

### Backend

- NODE_ENV: production
- PORT: 10000
- MONGODB_URI: (your MongoDB connection string)
- JWT_SECRET: (your JWT secret)
- ML_SERVICE_URL: https://cerebro-ai-ml-service.onrender.com

### Frontend

- VITE_API_URL: https://cerebro-ai-backend.onrender.com

## After Deployment

1. Wait for all services to build and deploy
2. Test your application by navigating to the frontend URL
3. Check the Render logs for any errors

## Troubleshooting

- If your ML service fails to start, make sure the model path is correct
- If your backend can't connect to MongoDB, verify your connection string
- For CORS issues, check that your backend is properly configured to accept requests from the frontend
