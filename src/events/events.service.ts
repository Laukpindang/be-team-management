import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(teamId: string, createEventDto: CreateEventDto) {
    return this.prisma.event.create({ data: { teamId, ...createEventDto } });
  }

  findAll(teamId: string) {
    return this.prisma.event.findMany({
      where: { teamId },
      omit: { teamId: true, createdAt: true, updatedAt: true },
    });
  }

  async findOne(teamId: string, id: string) {
    const event = await this.prisma.event.findUnique({ where: { id, teamId } });
    if (!event) {
      throw new NotFoundException(`Tim tidak memiliki Event dengan id ${id}`);
    }
    return event;
  }

  remove(teamId: string, id: string) {
    this.prisma.event.delete({ where: { id, teamId } });
  }
}
