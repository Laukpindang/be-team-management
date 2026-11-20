import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(teamId: string) {
    return this.prisma.teamMember.findMany({
      where: { teamId },
      select: {
        id: true,
        role: true,
        createdAt: true,
        user: {
          select: { email: true, name: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.teamMember.findUnique({ where: { id } });
  }

  async remove(id: string) {
    await this.prisma.teamMember.delete({ where: { id } });
  }
}
