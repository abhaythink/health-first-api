# Health First API Documentation

## Overview
A modular NestJS application with JWT authentication and patient management system using MongoDB.

## Environment Variables
Create a `.env` file in the project root with the following variables:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://localhost:27017/health-first-db
PORT=3000
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    }
  }
  ```

### Patients (Protected Routes)
All patient endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

#### Create Patient
- **POST** `/patients`
- **Body:**
  ```json
  {
    "firstName": "John",
    "middleName": "Michael",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "male",
    "maritalStatus": "single",
    "timezone": "America/New_York",
    "language": "English",
    "ssn": "123-45-6789",
    "race": "Caucasian",
    "ethnicity": "Non-Hispanic",
    "profilePicture": "https://example.com/profile.jpg"
  }
  ```

#### Get All Patients
- **GET** `/patients`
- **Response:** Array of patient objects

#### Get Patient by ID
- **GET** `/patients/:id`
- **Response:** Single patient object

#### Update Patient
- **PATCH** `/patients/:id`
- **Body:** Partial patient object (any fields you want to update)

#### Delete Patient
- **DELETE** `/patients/:id`
- **Response:** 204 No Content

## Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed with bcrypt
}
```

### Patient
```typescript
interface Patient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  timezone: string;
  language: string;
  ssn: string;
  race: string;
  ethnicity: string;
  profilePicture?: string;
}
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. Start MongoDB (if running locally):
   ```bash
   mongod
   ```

4. Run the application:
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm run build
   npm run start:prod
   ```

## Features

- ✅ JWT Authentication with Passport.js
- ✅ Password hashing with bcrypt
- ✅ MongoDB integration with Mongoose
- ✅ Input validation with class-validator
- ✅ Global exception handling
- ✅ ObjectId validation pipe
- ✅ Modular architecture
- ✅ Protected routes with JWT guard
- ✅ Response transformation with ClassSerializerInterceptor
- ✅ CORS enabled
- ✅ TypeScript support

## Architecture

```
src/
├── auth/
│   ├── dto/
│   ├── schemas/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── patient/
│   ├── dto/
│   ├── schemas/
│   ├── patient.controller.ts
│   ├── patient.service.ts
│   └── patient.module.ts
├── common/
│   ├── guards/
│   ├── pipes/
│   ├── filters/
│   └── common.module.ts
├── app.module.ts
└── main.ts
``` 