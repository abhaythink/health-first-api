import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true })
  firstName: string;

  @Prop()
  middleName?: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: string;

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: 'male' | 'female' | 'other';

  @Prop({ required: true, enum: ['single', 'married', 'divorced', 'widowed'] })
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';

  @Prop({ required: true })
  timezone: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  ssn: string;

  @Prop({ required: true })
  race: string;

  @Prop({ required: true })
  ethnicity: string;

  @Prop()
  profilePicture?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

// Transform _id to id in JSON responses
PatientSchema.set('toJSON', {
  transform: (doc: any, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
}); 