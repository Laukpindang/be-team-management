import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export type UpdateTaskDto = Partial<CreateTaskDto>;

export const UpdateTaskDto: new () => UpdateTaskDto = class extends PartialType(
  CreateTaskDto,
) {};
