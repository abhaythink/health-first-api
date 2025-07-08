import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { PatientService } from '../patient.service';
import { Patient, PatientDocument } from '../schemas/patient.schema';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

describe('PatientService', () => {
  let service: PatientService;
  let patientModel: Model<PatientDocument>;

  const mockPatientId = new Types.ObjectId('507f1f77bcf86cd799439011');
  
  const mockPatientData = {
    _id: mockPatientId,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    gender: 'male' as const,
    maritalStatus: 'single' as const,
    timezone: 'America/New_York',
    language: 'English',
    ssn: '123-45-6789',
    race: 'Caucasian',
    ethnicity: 'Non-Hispanic',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPatient = {
    ...mockPatientData,
    toJSON: jest.fn().mockReturnValue({
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
    }),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockPatient.save.mockResolvedValue(mockPatient);
    
    const mockPatientModel = {
      find: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
      findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: getModelToken(Patient.name),
          useValue: mockPatientModel,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    patientModel = module.get<Model<PatientDocument>>(getModelToken(Patient.name));

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      // Mock the constructor
      const mockSave = jest.fn().mockResolvedValue(mockPatient);
      const mockConstructor = jest.fn().mockImplementation(() => ({
        save: mockSave,
      }));
      
      // Replace the service's patientModel with our mock
      (service as any).patientModel = mockConstructor;

      // Act
      const result = await service.create(createPatientDto);

      // Assert
      expect(mockConstructor).toHaveBeenCalledWith(createPatientDto);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(mockPatient.toJSON());
    });
  });

  describe('findAll', () => {
    it('should return all patients', async () => {
      // Arrange
      const mockPatients = [mockPatient, { ...mockPatient, _id: new Types.ObjectId() }];
      const mockExec = jest.fn().mockResolvedValue(mockPatients);
      (patientModel.find as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act
      const result = await service.findAll();

      // Assert
      expect(patientModel.find).toHaveBeenCalledWith();
      expect(mockExec).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockPatient.toJSON());
    });

    it('should return empty array when no patients exist', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue([]);
      (patientModel.find as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act
      const result = await service.findAll();

      // Assert
      expect(patientModel.find).toHaveBeenCalledWith();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a patient by ID', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue(mockPatient);
      (patientModel.findById as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act
      const result = await service.findOne(mockPatientId);

      // Assert
      expect(patientModel.findById).toHaveBeenCalledWith(mockPatientId);
      expect(mockExec).toHaveBeenCalled();
      expect(mockPatient.toJSON).toHaveBeenCalled();
      expect(result).toEqual(mockPatient.toJSON());
    });

    it('should throw NotFoundException if patient not found', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue(null);
      (patientModel.findById as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act & Assert
      await expect(service.findOne(mockPatientId)).rejects.toThrow(
        new NotFoundException(`Patient with ID ${mockPatientId} not found`)
      );
      expect(patientModel.findById).toHaveBeenCalledWith(mockPatientId);
    });
  });

  describe('update', () => {
    const updatePatientDto: UpdatePatientDto = {
      firstName: 'Jane',
      language: 'Spanish',
    };

    it('should update a patient successfully', async () => {
      // Arrange
      const updatedPatient = { ...mockPatient, firstName: 'Jane' };
      const mockExec = jest.fn().mockResolvedValue(updatedPatient);
      (patientModel.findByIdAndUpdate as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act
      const result = await service.update(mockPatientId, updatePatientDto);

      // Assert
      expect(patientModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPatientId,
        updatePatientDto,
        { new: true }
      );
      expect(mockExec).toHaveBeenCalled();
      expect(result).toEqual(updatedPatient.toJSON());
    });

    it('should throw NotFoundException if patient not found', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue(null);
      (patientModel.findByIdAndUpdate as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act & Assert
      await expect(service.update(mockPatientId, updatePatientDto)).rejects.toThrow(
        new NotFoundException(`Patient with ID ${mockPatientId} not found`)
      );
      expect(patientModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPatientId,
        updatePatientDto,
        { new: true }
      );
    });
  });

  describe('remove', () => {
    it('should remove a patient successfully', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue(mockPatient);
      (patientModel.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act
      await service.remove(mockPatientId);

      // Assert
      expect(patientModel.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
      expect(mockExec).toHaveBeenCalled();
    });

    it('should throw NotFoundException if patient not found', async () => {
      // Arrange
      const mockExec = jest.fn().mockResolvedValue(null);
      (patientModel.findByIdAndDelete as jest.Mock).mockReturnValue({ exec: mockExec } as any);

      // Act & Assert
      await expect(service.remove(mockPatientId)).rejects.toThrow(
        new NotFoundException(`Patient with ID ${mockPatientId} not found`)
      );
      expect(patientModel.findByIdAndDelete).toHaveBeenCalledWith(mockPatientId);
    });
  });
}); 