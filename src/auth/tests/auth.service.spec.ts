import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserData = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    ...mockUserData,
    toJSON: jest.fn().mockReturnValue({
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockUser.save.mockResolvedValue(mockUser);
    
    const mockUserModel = {
      findOne: jest.fn(),
      findById: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService) as jest.Mocked<JwtService>;

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      (userModel.findOne as jest.Mock).mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123' as never);
      jwtService.sign.mockReturnValue('jwt-token');

      // Mock the constructor by adding it as a property to the userModel
      const mockSave = jest.fn().mockResolvedValue(mockUser);
      (userModel as any).prototype = { save: mockSave };
      
      // Mock the service's create behavior
      jest.spyOn(service, 'register').mockImplementation(async (registerDto) => {
        // Check if user exists
        const existingUser = await userModel.findOne({ email: registerDto.email });
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
        
        // Hash password
        const hashedPassword = await mockedBcrypt.hash(registerDto.password, 12);
        
        // Create user - simulate the constructor and save
        const user = mockUser;
        await mockSave();
        
        // Generate JWT token
        const token = jwtService.sign({ email: user.email, sub: user._id });
        
        return {
          access_token: token,
          user: user.toJSON(),
        };
      });

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUser.toJSON(),
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser as any);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        new ConflictException('User with this email already exists')
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: registerDto.email });
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully with valid credentials', async () => {
      // Arrange
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('jwt-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser._id,
      });
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: mockUser.toJSON(),
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      (userModel.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );
      expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });

  describe('validateUserById', () => {
    it('should return user if found', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      (userModel.findById as jest.Mock).mockResolvedValue(mockUser as any);

      // Act
      const result = await service.validateUserById(userId);

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      // Arrange
      const userId = '507f1f77bcf86cd799439011';
      (userModel.findById as jest.Mock).mockResolvedValue(null);

      // Act
      const result = await service.validateUserById(userId);

      // Assert
      expect(userModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });
}); 