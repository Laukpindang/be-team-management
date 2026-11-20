import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MembersService } from './members.service';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@ApiTags('members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams/:teamId/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@Param('teamId') teamId: string) {
    return this.membersService.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
