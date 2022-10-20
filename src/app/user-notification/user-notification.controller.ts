import { Controller, Body, Patch, Param, Get, UseGuards } from '@nestjs/common'

import { CookieGuard } from 'guards/cookie.guard'
import { UserNotificationService } from './user-notification.service'

@Controller('/user-notification')
export class UserNotificationController {
  constructor(private readonly service: UserNotificationService) {}

  // User route
  @Get()
  @UseGuards(CookieGuard)
  async getUserNotification(@Body('user') user: string) {
    return this.service.getUserNotification(user)
  }
  @Patch('/update-read-notification/:id')
  @UseGuards(CookieGuard)
  async updateReadNotification(
    @Param() params: { id: string },
    @Body('user') user: string,
  ) {
    return this.service.updateReadNotification(params.id, user)
  }
  @Patch('/update-read-notifications')
  @UseGuards(CookieGuard)
  async updateReadNotifications(@Body('user') user: string) {
    return this.service.updateReadNotifications(user)
  }
}
