import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    const patient = new this.patientModel(createPatientDto);
    const savedPatient = await patient.save();
    return savedPatient.toJSON();
  }

  async findAll(): Promise<any[]> {
    const patients = await this.patientModel.find().exec();
    return patients.map(patient => patient.toJSON());
  }

  async findOne(id: Types.ObjectId): Promise<any> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient.toJSON();
  }

  async update(id: Types.ObjectId, updatePatientDto: UpdatePatientDto): Promise<any> {
    const patient = await this.patientModel.findByIdAndUpdate(
      id,
      updatePatientDto,
      { new: true }
    ).exec();
    
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient.toJSON();
  }

  async remove(id: Types.ObjectId): Promise<void> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }
} 