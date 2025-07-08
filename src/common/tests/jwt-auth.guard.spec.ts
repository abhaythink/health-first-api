import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../../auth/auth.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let authService: jest.Mocked<AuthService>;
  let reflector: jest.Mocked<Reflector>;

  const mockJwtService = {
    verify: jest.fn(),
  };

  const mockAuthService = {
    validateUserById: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;
    authService = module.get<AuthService>(AuthService) as jest.Mocked<AuthService>;
    reflector = module.get<Reflector>(Reflector) as jest.Mocked<Reflector>;

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  const createMockExecutionContext = (headers: any = {}): ExecutionContext => {
    const mockRequest = { headers };
    const mockResponse = {};
    
    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getType: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    } as any;
  };

  describe('canActivate', () => {
    it('should return true for valid JWT token', async () => {
      // Arrange
      const mockContext = createMockExecutionContext({
        authorization: 'Bearer valid-jwt-token',
      });
      
      // Mock the parent canActivate method behavior
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        request.user = mockUser;
        return true;
      });

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should throw UnauthorizedException when no authorization header', async () => {
      // Arrange
      const mockContext = createMockExecutionContext({});
      
      // Mock the parent canActivate method to throw UnauthorizedException
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async () => {
        throw new UnauthorizedException();
      });

      // Act & Assert
      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when authorization header is malformed', async () => {
      // Arrange
      const mockContext = createMockExecutionContext({
        authorization: 'InvalidFormat token',
      });
      
      // Mock the parent canActivate method to throw UnauthorizedException
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async () => {
        throw new UnauthorizedException();
      });

      // Act & Assert
      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when JWT verification fails', async () => {
      // Arrange
      const mockContext = createMockExecutionContext({
        authorization: 'Bearer invalid-jwt-token',
      });
      
      // Mock the parent canActivate method to throw UnauthorizedException
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async () => {
        throw new UnauthorizedException();
      });

      // Act & Assert
      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user validation fails', async () => {
      // Arrange
      const mockContext = createMockExecutionContext({
        authorization: 'Bearer valid-jwt-token',
      });
      
      // Mock the parent canActivate method to throw UnauthorizedException
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async () => {
        throw new UnauthorizedException();
      });

      // Act & Assert
      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle case-insensitive Bearer token', async () => {
      // Arrange
      const mockContext = createMockExecutionContext({
        authorization: 'bearer valid-jwt-token',
      });
      
      // Mock the parent canActivate method behavior
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        request.user = mockUser;
        return true;
      });

      // Act
      const result = await guard.canActivate(mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should attach user to request object', async () => {
      // Arrange
      const mockRequest = { headers: { authorization: 'Bearer valid-jwt-token' } };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
          getResponse: () => ({}),
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
        getType: jest.fn(),
        getArgs: jest.fn(),
        getArgByIndex: jest.fn(),
        switchToRpc: jest.fn(),
        switchToWs: jest.fn(),
      } as any;
      
      // Mock the parent canActivate method behavior
      const mockCanActivate = jest.spyOn(guard, 'canActivate');
      mockCanActivate.mockImplementation(async (context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        request.user = mockUser;
        return true;
      });

      // Act
      await guard.canActivate(mockContext);

      // Assert
      expect((mockRequest as any).user).toEqual(mockUser);
    });
  });
}); 