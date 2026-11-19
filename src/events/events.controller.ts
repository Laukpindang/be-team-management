import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events')
@Controller('teams/:teamId/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Param('teamId') teamId: string,
    @Body() createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(teamId, createEventDto);
  }

  @Get()
  findAll(@Param('teamId') teamId: string) {
    return this.eventsService.findAll(teamId);
  }

  @Get(':id')
  findOne(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.eventsService.findOne(teamId, id);
  }

  @Delete(':id')
  remove(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.eventsService.remove(teamId, id);
  }
}
