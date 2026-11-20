import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsIn(['UNASSIGNED', 'IN_PROGRESS', 'COMPLETED'])
  status!: 'UNASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

  @ApiProperty()
  @IsString()
  @IsOptional()
  assigneeId?: string;
}
