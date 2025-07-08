import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';

describe('ParseObjectIdPipe', () => {
  let pipe: ParseObjectIdPipe;

  beforeEach(() => {
    pipe = new ParseObjectIdPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should transform valid ObjectId string to ObjectId', () => {
      // Arrange
      const validObjectId = '507f1f77bcf86cd799439011';
      const expectedObjectId = new Types.ObjectId(validObjectId);

      // Act
      const result = pipe.transform(validObjectId);

      // Assert
      expect(result).toBeInstanceOf(Types.ObjectId);
      expect(result.toString()).toBe(expectedObjectId.toString());
    });

    it('should transform ObjectId instance to ObjectId', () => {
      // Arrange
      const objectId = new Types.ObjectId('507f1f77bcf86cd799439011');

      // Act
      const result = pipe.transform(objectId);

      // Assert
      expect(result).toBeInstanceOf(Types.ObjectId);
      expect(result.toString()).toBe(objectId.toString());
    });

    it('should throw BadRequestException for invalid ObjectId string', () => {
      // Arrange
      const invalidObjectId = 'invalid-object-id';

      // Act & Assert
      expect(() => pipe.transform(invalidObjectId)).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
    });

    it('should throw BadRequestException for null value', () => {
      // Act & Assert
      expect(() => pipe.transform(null)).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
    });

    it('should throw BadRequestException for undefined value', () => {
      // Act & Assert
      expect(() => pipe.transform(undefined)).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
    });

    it('should throw BadRequestException for empty string', () => {
      // Act & Assert
      expect(() => pipe.transform('')).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
    });

    it('should throw BadRequestException for non-string, non-ObjectId value', () => {
      // Act & Assert
      expect(() => pipe.transform(123 as any)).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
      expect(() => pipe.transform({} as any)).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
      expect(() => pipe.transform([] as any)).toThrow(
        new BadRequestException('Invalid ObjectId')
      );
    });

    it('should handle ObjectId with different valid formats', () => {
      // Arrange
      const validObjectIds = [
        '507f1f77bcf86cd799439011',
        '507f191e810c19729de860ea',
        '123456789012345678901234',
      ];

      // Act & Assert
      validObjectIds.forEach((id) => {
        const result = pipe.transform(id);
        expect(result).toBeInstanceOf(Types.ObjectId);
        expect(result.toString()).toBe(id);
      });
    });
  });
}); 