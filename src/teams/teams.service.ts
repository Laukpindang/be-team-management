import { ConflictException, Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { PrismaService } from '@/prisma/prisma.service';

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

  remove(id: string) {
    this.prisma.team.delete({ where: { id } });
  }

  hasTeam(userId: string) {
    return this.prisma.teamMember.findFirst({
      where: { userId },
      select: { id: true, team: { select: { id: true } } },
    });
  }
}
