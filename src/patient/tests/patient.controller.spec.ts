import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { PatientController } from '../patient.controller';
import { PatientService } from '../patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

describe('PatientController', () => {
  let controller: PatientController;
  let patientService: jest.Mocked<PatientService>;

  const mockPatientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockPatientId = new Types.ObjectId('507f1f77bcf86cd799439011');
  const mockPatient = {
    id: mockPatientId.toString(),
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    maritalStatus: 'single',
    timezone: 'America/New_York',
    language: 'English',
    ssn: '123-45-6789',
    race: 'Caucasian',
    ethnicity: 'Non-Hispanic',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<PatientController>(PatientController);
    patientService = module.get<PatientService>(PatientService) as jest.Mocked<PatientService>;

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createPatientDto: CreatePatientDto = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      maritalStatus: 'single',
      timezone: 'America/New_York',
      language: 'English',
      ssn: '123-45-6789',
      race: 'Caucasian',
      ethnicity: 'Non-Hispanic',
    };

    it('should create a patient successfully', async () => {
      // Arrange
      patientService.create.mockResolvedValue(mockPatient);

      // Act
      const result = await controller.create(createPatientDto);

      // Assert
      expect(patientService.create).toHaveBeenCalledWith(createPatientDto);
      expect(patientService.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPatient);
    });

    it('should propagate service errors', async () => {
      // Arrange
      const error = new Error('Creation failed');
      patientService.create.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.create(createPatientDto)).rejects.toThrow(error);
      expect(patientService.create).toHaveBeenCalledWith(createPatientDto);
    });
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      // Arrange
      const mockPatients = [mockPatient, { ...mockPatient, id: 'another-id' }];
      patientService.findAll.mockResolvedValue(mockPatients);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(patientService.findAll).toHaveBeenCalledWith();
      expect(patientService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPatients);
    });

    it('should propagate service errors', async () => {
      // Arrange
      const error = new Error('Find all failed');
      patientService.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow(error);
      expect(patientService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a patient by ID', async () => {
      // Arrange
      patientService.findOne.mockResolvedValue(mockPatient);

      // Act
      const result = await controller.findOne(mockPatientId);

      // Assert
      expect(patientService.findOne).toHaveBeenCalledWith(mockPatientId);
      expect(patientService.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPatient);
    });

    it('should propagate service errors', async () => {
      // Arrange
      const error = new Error('Patient not found');
      patientService.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne(mockPatientId)).rejects.toThrow(error);
      expect(patientService.findOne).toHaveBeenCalledWith(mockPatientId);
    });
  });

  describe('update', () => {
    const updatePatientDto: UpdatePatientDto = {
      firstName: 'Jane',
      language: 'Spanish',
    };

    it('should update a patient successfully', async () => {
      // Arrange
      const updatedPatient = { ...mockPatient, firstName: 'Jane', language: 'Spanish' };
      patientService.update.mockResolvedValue(updatedPatient);

      // Act
      const result = await controller.update(mockPatientId, updatePatientDto);

      // Assert
      expect(patientService.update).toHaveBeenCalledWith(mockPatientId, updatePatientDto);
      expect(patientService.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedPatient);
    });

    it('should propagate service errors', async () => {
      // Arrange
      const error = new Error('Update failed');
      patientService.update.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.update(mockPatientId, updatePatientDto)).rejects.toThrow(error);
      expect(patientService.update).toHaveBeenCalledWith(mockPatientId, updatePatientDto);
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
      // Arrange
      patientService.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(mockPatientId);

      // Assert
      expect(patientService.remove).toHaveBeenCalledWith(mockPatientId);
      expect(patientService.remove).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    it('should propagate service errors', async () => {
      // Arrange
      const error = new Error('Remove failed');
      patientService.remove.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.remove(mockPatientId)).rejects.toThrow(error);
      expect(patientService.remove).toHaveBeenCalledWith(mockPatientId);
    });
  });
}); 