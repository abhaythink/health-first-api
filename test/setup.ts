import 'reflect-metadata';

// Global test setup
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/health-first-test';
});

// Global test teardown
afterAll(() => {
  // Clean up any global resources if needed
});

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
  // Suppress console.error and console.warn during tests unless explicitly needed
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore original console methods
  console.error = originalError;
  console.warn = originalWarn;
  
  // Clear all mocks after each test
  jest.clearAllMocks();
}); 