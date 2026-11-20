import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  create(eventId: string, data: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...data,
        eventId,
        status: data.assigneeId ? 'IN_PROGRESS' : 'UNASSIGNED',
      },
    });
  }

  findAll(eventId: string) {
    return this.prisma.task.findMany({ where: { eventId } });
  }

  async findOne(eventId: string, id: string) {
    const task = await this.prisma.task.findUnique({ where: { id, eventId } });
    if (!task) {
      throw new NotFoundException(`Task dengan id ${id} tidak ditemukan`);
    }
    return task;
  }

  async update(eventId: string, id: string, newTask: UpdateTaskDto) {
    const exist = await this.prisma.task.findUnique({ where: { id, eventId } });
    if (!exist) {
      throw new NotFoundException(`Task dengan id ${id} tidak ditemukan`);
    }
    return this.prisma.task.update({ where: { id }, data: newTask });
  }

  async remove(eventId: string, id: string) {
    const exist = await this.prisma.task.findUnique({ where: { id, eventId } });
    if (!exist) {
      throw new NotFoundException(`Task dengan id ${id} tidak ditemukan`);
    }
    await this.prisma.task.delete({ where: { id } });
  }
}
