# Unit Test Documentation

## Overview
This document describes the comprehensive unit test suite for the Health First API NestJS application. The tests are built using Jest and @nestjs/testing utilities.

## Test Structure

### Auth Module Tests

#### `src/auth/tests/auth.service.spec.ts`
**Purpose**: Tests the AuthService business logic for user authentication.

**Test Cases**:
- ✅ **register()**: 
  - Should register a new user with hashed password
  - Should throw ConflictException if user already exists
- ✅ **login()**: 
  - Should authenticate user with valid credentials
  - Should throw UnauthorizedException for invalid email
  - Should throw UnauthorizedException for invalid password
- ✅ **validateUserById()**: 
  - Should return user if found
  - Should return null if user not found

**Mocked Dependencies**:
- `UserModel` (Mongoose model)
- `JwtService`
- `bcrypt` module

#### `src/auth/tests/auth.controller.spec.ts`
**Purpose**: Tests the AuthController HTTP request handling.

**Test Cases**:
- ✅ **register()**: Should call AuthService.register() with correct DTO
- ✅ **login()**: Should call AuthService.login() with correct DTO
- ✅ **Error Propagation**: Should propagate service errors to HTTP layer

**Mocked Dependencies**:
- `AuthService`

### Patient Module Tests

#### `src/patient/tests/patient.service.spec.ts`
**Purpose**: Tests the PatientService CRUD operations.

**Test Cases**:
- ✅ **create()**: Should create patient and return JSON response
- ✅ **findAll()**: 
  - Should return all patients
  - Should return empty array when no patients exist
- ✅ **findOne()**: 
  - Should return patient by ID
  - Should throw NotFoundException if patient not found
- ✅ **update()**: 
  - Should update patient and return updated data
  - Should throw NotFoundException if patient not found
- ✅ **remove()**: 
  - Should remove patient successfully
  - Should throw NotFoundException if patient not found

**Mocked Dependencies**:
- `PatientModel` (Mongoose model)

#### `src/patient/tests/patient.controller.spec.ts`
**Purpose**: Tests the PatientController HTTP request handling and JWT protection.

**Test Cases**:
- ✅ **create()**: Should call PatientService.create() with DTO
- ✅ **findAll()**: Should call PatientService.findAll()
- ✅ **findOne()**: Should call PatientService.findOne() with ObjectId
- ✅ **update()**: Should call PatientService.update() with ID and DTO
- ✅ **remove()**: Should call PatientService.remove() with ID
- ✅ **Error Propagation**: Should propagate service errors
- ✅ **JWT Protection**: JwtAuthGuard is mocked to allow access

**Mocked Dependencies**:
- `PatientService`
- `JwtAuthGuard` (overridden to allow access)

### Common Module Tests

#### `src/common/tests/parse-object-id.pipe.spec.ts`
**Purpose**: Tests the ParseObjectIdPipe for MongoDB ObjectId validation.

**Test Cases**:
- ✅ **Valid ObjectId String**: Should transform to ObjectId instance
- ✅ **ObjectId Instance**: Should pass through ObjectId instances
- ✅ **Invalid Formats**: Should throw BadRequestException for:
  - Invalid ObjectId strings
  - null/undefined values
  - Empty strings
  - Non-string, non-ObjectId values
- ✅ **Multiple Valid Formats**: Should handle different valid ObjectId formats

#### `src/common/tests/jwt-auth.guard.spec.ts`
**Purpose**: Tests the JwtAuthGuard for JWT token validation and user authentication.

**Test Cases**:
- ✅ **Valid JWT**: Should return true and attach user to request
- ✅ **Missing Authorization**: Should throw UnauthorizedException
- ✅ **Malformed Header**: Should throw UnauthorizedException
- ✅ **Invalid JWT**: Should throw UnauthorizedException when verification fails
- ✅ **User Validation**: Should throw UnauthorizedException when user not found
- ✅ **Case Insensitive**: Should handle 'bearer' and 'Bearer' tokens
- ✅ **Request Attachment**: Should attach validated user to request object

**Mocked Dependencies**:
- `JwtService`
- `AuthService`
- `Reflector`

## Test Configuration

### `jest.config.js`
- **Environment**: Node.js
- **Test Pattern**: `**/*.spec.ts`
- **Coverage**: Excludes DTOs, schemas, and main.ts
- **Setup**: Uses `test/setup.ts` for global configuration

### `test/setup.ts`
- **Environment Variables**: Sets test-specific JWT secrets and MongoDB URI
- **Console Mocking**: Suppresses console.error/warn during tests
- **Global Cleanup**: Clears mocks after each test

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.service.spec.ts

# Run tests with verbose output
npm test -- --verbose
```

## Mock Strategy

### Database Mocking
- **Mongoose Models**: Mocked using `jest.fn()` with chainable methods
- **Document Methods**: `.save()`, `.toJSON()`, `.exec()` are mocked
- **Query Methods**: `.find()`, `.findById()`, `.findByIdAndUpdate()` return mock chains

### Service Mocking
- **Method Mocking**: All service methods mocked with `jest.fn()`
- **Return Values**: Use `mockResolvedValue()` for async operations
- **Error Simulation**: Use `mockRejectedValue()` for error scenarios

### Guard Mocking
- **JWT Guard**: Overridden to always return `true` for controller tests
- **Auth Guard**: Mocked to test both success and failure scenarios

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

## Best Practices

1. **Isolation**: Each test is independent with proper setup/teardown
2. **Arrange-Act-Assert**: Clear test structure for readability
3. **Mock Dependencies**: All external dependencies are mocked
4. **Error Testing**: Both success and failure scenarios are tested
5. **Edge Cases**: Boundary conditions and invalid inputs are tested
6. **Descriptive Names**: Test names clearly describe the scenario
7. **Grouped Tests**: Related tests are grouped using `describe()` blocks

## Integration with CI/CD

The unit tests are designed to run in CI/CD pipelines:
- No external dependencies (database, network)
- Fast execution (< 30 seconds)
- Deterministic results
- Proper error reporting

## Future Enhancements

1. **Parameterized Tests**: Add test.each() for multiple input scenarios
2. **Snapshot Testing**: For complex object comparisons
3. **Performance Tests**: Add timing assertions for critical paths
4. **Mutation Testing**: Verify test quality with mutation testing tools 