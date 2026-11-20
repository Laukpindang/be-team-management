import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { CurrentUser } from '@/auth/decorator/current-user.decorator';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @CurrentUser('id') userId: string,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamsService.create(userId, createTeamDto);
  }

  @Post('join/:id')
  joinTeam(@CurrentUser('id') userId: string, @Param('id') teamId: string) {
    return this.teamsService.joinTeam(userId, teamId);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.teamsService.findAll(userId);
  }

  @Get('has-team')
  hasTeam(@CurrentUser('id') userId: string) {
    return this.teamsService.hasTeam(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Get(':id/stats')
  stats(@Param('id') id: string) {
    return this.teamsService.getStats(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
