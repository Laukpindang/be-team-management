import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events/:eventId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(eventId, createTaskDto);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.tasksService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.tasksService.findOne(eventId, id);
  }

  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(eventId, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('eventId') eventId: string, @Param('id') id: string) {
    return this.tasksService.remove(eventId, id);
  }
}
