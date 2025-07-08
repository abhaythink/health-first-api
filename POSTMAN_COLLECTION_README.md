# Health First API - Postman Collection

This comprehensive Postman collection provides complete API testing capabilities for the Health First NestJS application with JWT authentication and patient management.

## 📁 Files Included

- `Health-First-API.postman_collection.json` - Main Postman collection with all API endpoints
- `Health-First-API.postman_environment.json` - Environment variables for different deployment environments
- `POSTMAN_COLLECTION_README.md` - This documentation file

## 🚀 Quick Start

### 1. Import Collection & Environment

1. **Import Collection:**
   - Open Postman
   - Click "Import" → "Choose Files"
   - Select `Health-First-API.postman_collection.json`

2. **Import Environment:**
   - Click "Import" → "Choose Files"
   - Select `Health-First-API.postman_environment.json`
   - Select the "Health First API - Development" environment in the top-right dropdown

### 2. Start Your API Server

```bash
# Make sure your API is running
npm run start:dev

# The API should be available at http://localhost:3000
```

### 3. Run the Collection

**Option A: Run Individual Requests**
- Navigate through the collection folders
- Execute requests in order (Authentication → Patients)

**Option B: Run Entire Collection**
- Click "..." next to collection name → "Run collection"
- Select environment and click "Run Health First API"

## 📋 Collection Structure

### 🔐 Authentication
- **Register User** - Create new user account
- **Login User** - Authenticate and get JWT token
- **Register User - Conflict Test** - Test duplicate email handling
- **Login User - Invalid Credentials** - Test invalid login

### 👥 Patients (Protected Routes)
- **Create Patient** - Add new patient record
- **Get All Patients** - Retrieve all patients
- **Get Patient by ID** - Retrieve specific patient
- **Update Patient** - Modify patient information
- **Delete Patient** - Remove patient record
- **Get Patient by ID - Not Found** - Test 404 handling
- **Create Patient - Invalid Data** - Test validation errors

### 🔒 Authorization Tests
- **Access Protected Route Without Token** - Test unauthorized access
- **Access Protected Route With Invalid Token** - Test invalid JWT
- **Access Protected Route With Malformed Token** - Test malformed auth header

### ✅ Validation Tests
- **Register - Invalid Email** - Test email validation
- **Register - Short Password** - Test password length validation
- **Create Patient - Missing Required Fields** - Test required field validation

### 🏥 Health Check
- **Root Endpoint** - Test basic API connectivity

## 🔧 Environment Variables

The collection uses the following environment variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `base_url` | API base URL | `http://localhost:3000` |
| `user_email` | Test user email | `test@example.com` |
| `user_password` | Test user password | `password123` |
| `jwt_token` | JWT token (auto-populated) | `""` |
| `user_id` | User ID (auto-populated) | `""` |
| `patient_id` | Patient ID (auto-populated) | `""` |
| `test_patient_email` | Test patient email | `patient@example.com` |
| `api_version` | API version | `v1` |

## 🧪 Testing Workflow

### Recommended Testing Order:

1. **Health Check**
   ```
   GET / → Should return "Hello World!"
   ```

2. **Authentication Flow**
   ```
   POST /auth/register → Creates user & returns JWT
   POST /auth/login → Authenticates & returns JWT
   ```

3. **Patient Management**
   ```
   POST /patients → Creates patient (requires JWT)
   GET /patients → Lists all patients
   GET /patients/:id → Gets specific patient
   PATCH /patients/:id → Updates patient
   DELETE /patients/:id → Deletes patient
   ```

4. **Error Handling Tests**
   ```
   Test unauthorized access
   Test invalid data validation
   Test not found scenarios
   ```

### Automated Token Management

The collection automatically:
- Extracts JWT tokens from login/register responses
- Stores tokens in environment variables
- Includes tokens in subsequent requests
- Stores patient IDs for CRUD operations

## 🔍 Test Scripts

Each request includes comprehensive test scripts that verify:

- **Status Codes** - Correct HTTP response codes
- **Response Structure** - Expected JSON properties
- **Data Validation** - Proper data types and values
- **Error Handling** - Appropriate error messages
- **Performance** - Response time under 5 seconds

### Example Test Script:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has access_token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('access_token');
    
    // Store token for other requests
    pm.environment.set("jwt_token", jsonData.access_token);
});
```

## 🌍 Multiple Environments

### Development Environment
```json
{
  "base_url": "http://localhost:3000",
  "user_email": "test@example.com",
  "user_password": "password123"
}
```

### Staging Environment (Example)
```json
{
  "base_url": "https://staging-api.healthfirst.com",
  "user_email": "staging@example.com",
  "user_password": "staging123"
}
```

### Production Environment (Example)
```json
{
  "base_url": "https://api.healthfirst.com",
  "user_email": "prod@example.com",
  "user_password": "prod123"
}
```

## 📊 Sample Request/Response

### Register User
**Request:**
```json
POST /auth/register
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Patient
**Request:**
```json
POST /patients
Authorization: Bearer <jwt_token>
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

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
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
  "profilePicture": "https://example.com/profile.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🚨 Error Handling Examples

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 400 Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Patient with ID 507f1f77bcf86cd799439011 not found",
  "error": "Not Found",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized Errors**
   - Ensure JWT token is valid and not expired
   - Check if token is properly stored in environment variables
   - Verify Authorization header format: `Bearer <token>`

2. **Connection Refused**
   - Ensure API server is running on correct port
   - Check `base_url` environment variable
   - Verify MongoDB connection

3. **Validation Errors**
   - Check request body format matches DTO requirements
   - Ensure all required fields are provided
   - Verify data types and constraints

4. **Environment Variables Not Working**
   - Select correct environment in Postman
   - Check variable names match exactly
   - Ensure variables are enabled

### Debug Steps:

1. **Check API Health**
   ```
   GET / → Should return "Hello World!"
   ```

2. **Verify Environment**
   ```
   Check base_url, user_email, user_password variables
   ```

3. **Test Authentication**
   ```
   POST /auth/register → Should return JWT token
   ```

4. **Check Token Storage**
   ```
   Verify jwt_token is stored in environment after login
   ```

## 📈 Performance Testing

The collection includes performance tests that verify:
- Response time < 5000ms
- Proper content-type headers
- Efficient database queries

### Running Performance Tests:
1. Use Postman Collection Runner
2. Set iterations to 10-100
3. Monitor response times and error rates
4. Check for memory leaks or performance degradation

## 🔒 Security Testing

The collection includes security tests for:
- JWT token validation
- Authorization header handling
- Input validation and sanitization
- SQL injection prevention (via Mongoose)
- XSS prevention

### Security Best Practices:
- Never commit JWT tokens to version control
- Use environment variables for sensitive data
- Regularly rotate JWT secrets
- Implement rate limiting in production
- Use HTTPS in production environments

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Test Documentation](./TEST_DOCUMENTATION.md)
- [Postman Documentation](https://learning.postman.com/)
- [NestJS Documentation](https://docs.nestjs.com/)

## 🤝 Contributing

When adding new endpoints to the API:

1. Add corresponding requests to the Postman collection
2. Include proper test scripts
3. Update environment variables if needed
4. Add documentation to this README
5. Test all scenarios (success, error, edge cases)

## 📝 License

This Postman collection is part of the Health First API project and follows the same licensing terms. 