# CereBro AI Backend

Backend server for the CereBro AI brain tumor detection application.

## Setup

1. Create a MongoDB Atlas account and database
2. Update the `.env` file with your MongoDB connection string
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cerebroai?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_replace_in_production
JWT_EXPIRE=30d
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user

  - Request body: `{ name, email, password }`
  - Response: User object with JWT token

- **POST /api/auth/login** - Login existing user

  - Request body: `{ email, password }`
  - Response: User object with JWT token

- **GET /api/auth/me** - Get current user profile (Protected)

  - Headers: `Authorization: Bearer <token>`
  - Response: User object

- **GET /api/auth/logout** - Logout user (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: Success message
