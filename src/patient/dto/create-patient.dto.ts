import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(['male', 'female', 'other'])
  @IsNotEmpty()
  gender: 'male' | 'female' | 'other';

  @IsEnum(['single', 'married', 'divorced', 'widowed'])
  @IsNotEmpty()
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';

  @IsString()
  @IsNotEmpty()
  timezone: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  ssn: string;

  @IsString()
  @IsNotEmpty()
  race: string;

  @IsString()
  @IsNotEmpty()
  ethnicity: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;
} 