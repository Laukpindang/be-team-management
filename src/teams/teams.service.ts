import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { TaskStatus } from '@/generated/prisma/enums';

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTeamDto: CreateTeamDto) {
    const newTeamId = await this.prisma.$transaction(async (tx) => {
      const team = await tx.team.create({
        data: createTeamDto,
        select: { id: true },
      });
      await tx.teamMember.create({
        data: { teamId: team.id, userId, role: 'OWNER' },
      });
      return team.id;
    });
    return newTeamId;
  }

  async findAll(userId: string) {
    const team = await this.prisma.teamMember.findMany({
      where: { userId },
      select: {
        role: true,
        team: {
          select: { id: true, name: true, description: true },
        },
      },
      orderBy: { team: { createdAt: 'desc' } },
    });
    return team.map((i) => ({
      id: i.team.id,
      name: i.team.name,
      description: i.team.description,
      role: i.role,
    }));
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({ where: { id } });
  }

  async joinTeam(userId: string, teamId: string) {
    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId,
        userId,
      },
      select: { id: true },
    });
    if (existingMember) {
      throw new ConflictException('Anda sudah menjadi anggota di tim ini.');
    }
    const newMember = await this.prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role: 'MEMBER',
      },
      select: { id: true },
    });

    return newMember.id;
  }

  async remove(id: string) {
    await this.prisma.team.delete({ where: { id } });
  }

  hasTeam(userId: string) {
    return this.prisma.teamMember.findFirst({
      where: { userId },
      select: { id: true, team: { select: { id: true } } },
    });
  }

  async getStats(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        description: true,
        members: {
          select: {
            role: true,
          },
        },
        events: {
          orderBy: { startTime: 'asc' },
          select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
            tasks: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team dengan id "${teamId}" tidak ditemukan`);
    }

    const totalMembers = team.members.length;

    const eventsStats = team.events.map((event) => {
      const totalTasks = event.tasks.length;
      const unassignedCount = event.tasks.filter(
        (t) => t.status === TaskStatus.UNASSIGNED,
      ).length;
      const inProgressCount = event.tasks.filter(
        (t) => t.status === TaskStatus.IN_PROGRESS,
      ).length;
      const completedCount = event.tasks.filter(
        (t) => t.status === TaskStatus.COMPLETED,
      ).length;

      const completionPercentage =
        totalTasks > 0
          ? Number(((completedCount / totalTasks) * 100).toFixed(1))
          : 0;

      return {
        id: event.id,
        name: event.name,
        startTime: event.startTime,
        endTime: event.endTime,
        tasks: {
          total: totalTasks,
          unassigned: unassignedCount,
          inProgress: inProgressCount,
          completed: completedCount,
          completionPercentage,
        },
      };
    });

    return {
      teamId: team.id,
      teamName: team.name,
      teamDescription: team.description,
      members: totalMembers,
      events: {
        total: eventsStats.length,
        items: eventsStats,
      },
    };
  }
}
