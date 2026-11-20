import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(50)
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  description!: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dueDate!: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  assigneeId?: string;
}
