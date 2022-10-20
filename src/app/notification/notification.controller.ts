import {
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Param,
  Sse,
  Body,
  UseGuards,
} from '@nestjs/common'
import { AdminGuard } from 'guards/admin.guard'
import { CookieGuard } from 'guards/cookie.guard'

import { ParseLimitPipe } from 'pipelines/limit.pipe'
import { ParseOffsetPipe } from 'pipelines/offset.pipe'
import { EventsService } from '../events.service'
import { NotificationDto, UpdateNotificationDto } from './notification.dto'
import { NotificationService } from './notification.service'

@Controller('/notification')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly eventsService: EventsService,
  ) {}
  // Initialize SSE
  @Sse('sse')
  @UseGuards(CookieGuard)
  events() {
    return this.eventsService.subscribe()
  }
  // User route
  @Get('/all')
  @UseGuards(CookieGuard)
  async getNotifications(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getNotifications({ search, offset, limit })
  }

  // Admin Route
  @Patch('/:id')
  @UseGuards(CookieGuard, AdminGuard)
  async updateNotification(
    @Body() body: UpdateNotificationDto,
    @Param() params: { id: string },
  ) {
    return this.service.updateNotification(params.id, body)
  }
  @Post()
  @UseGuards(CookieGuard, AdminGuard)
  async createNotifications(@Body() body: NotificationDto) {
    const notification = await this.service.createNotification(body)
    this.eventsService.emit(notification)
    return notification
  }
}
