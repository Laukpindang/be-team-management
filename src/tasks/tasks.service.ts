import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateTaskDto) {
    return this.prisma.task.create({ data });
  }

  findAll(eventId: string) {
    return this.prisma.task.findMany({ where: { eventId } });
  }

  findOne(id: string) {
    const task = this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async update(id: string, newTask: UpdateTaskDto) {
    const exist = await this.prisma.task.findUnique({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`Task dengan id ${id} tidak ditemukan`);
    }
    return this.prisma.task.update({ where: { id }, data: newTask });
  }

  async remove(id: string) {
    const exist = await this.prisma.task.findUnique({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`Task dengan id ${id} tidak ditemukan`);
    }
    await this.prisma.task.delete({ where: { id } });
  }
}
