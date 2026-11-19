import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsAfterDate } from '../validator/is-after-date.validator';

export class CreateEventDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({
    example: '2026-11-20T08:00:00.000Z',
    description: 'Format ISO 8601',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime!: Date;

  @ApiProperty({
    example: '2026-11-20T08:00:00.000Z',
    description: 'Format ISO 8601',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @IsAfterDate('startTime')
  endTime!: Date;
}
