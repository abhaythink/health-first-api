#!/bin/bash

# Health First API Test Script
# Make sure the application is running before executing this script

BASE_URL="http://localhost:3000"

echo "🧪 Testing Health First API..."
echo "================================"

# Test 1: Register a new user
echo "1. Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Extract token from response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token from registration"
  exit 1
fi

echo "✅ Registration successful! Token: ${TOKEN:0:20}..."
echo ""

# Test 2: Login with the same user
echo "2. Logging in with the same user..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 3: Create a patient (protected route)
echo "3. Creating a patient (protected route)..."
CREATE_PATIENT_RESPONSE=$(curl -s -X POST "$BASE_URL/patients" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
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
  }')

echo "Response: $CREATE_PATIENT_RESPONSE"
echo ""

# Extract patient ID
PATIENT_ID=$(echo $CREATE_PATIENT_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$PATIENT_ID" ]; then
  echo "❌ Failed to create patient"
  exit 1
fi

echo "✅ Patient created successfully! ID: $PATIENT_ID"
echo ""

# Test 4: Get all patients
echo "4. Getting all patients..."
GET_PATIENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/patients" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_PATIENTS_RESPONSE"
echo ""

# Test 5: Get patient by ID
echo "5. Getting patient by ID..."
GET_PATIENT_RESPONSE=$(curl -s -X GET "$BASE_URL/patients/$PATIENT_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_PATIENT_RESPONSE"
echo ""

# Test 6: Update patient
echo "6. Updating patient..."
UPDATE_PATIENT_RESPONSE=$(curl -s -X PATCH "$BASE_URL/patients/$PATIENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "Jane",
    "gender": "female"
  }')

echo "Response: $UPDATE_PATIENT_RESPONSE"
echo ""

# Test 7: Test unauthorized access
echo "7. Testing unauthorized access (should fail)..."
UNAUTHORIZED_RESPONSE=$(curl -s -X GET "$BASE_URL/patients")

echo "Response: $UNAUTHORIZED_RESPONSE"
echo ""

# Test 8: Delete patient
echo "8. Deleting patient..."
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/patients/$PATIENT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "HTTP Status: %{http_code}")

echo "Response: $DELETE_RESPONSE"
echo ""

echo "🎉 API testing completed!"
echo "================================" 