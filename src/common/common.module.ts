import { Module } from '@nestjs/common';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  providers: [ParseObjectIdPipe, HttpExceptionFilter],
  exports: [ParseObjectIdPipe, HttpExceptionFilter],
})
export class CommonModule {} 