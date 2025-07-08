import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    // Check if the value is already an ObjectId instance
    if (value instanceof Types.ObjectId) {
      return value;
    }

    // Check if the value is a string and a valid ObjectId
    if (typeof value === 'string' && value.trim() !== '' && Types.ObjectId.isValid(value)) {
      return new Types.ObjectId(value);
    }

    // Reject any other input types
    throw new BadRequestException('Invalid ObjectId');
  }
} 