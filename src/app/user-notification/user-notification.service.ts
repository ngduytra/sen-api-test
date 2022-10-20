import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'

import { EnvironmentVariables } from 'config/configuration'
import { NewUserNotificationDto } from './user-notification.dto'
import { NotificationService } from '../notification/notification.service'
import {
  UserNotification,
  UserNotificationDocument,
} from 'schemas/user-notification.schema'

@Injectable()
export class UserNotificationService {
  constructor(
    @InjectModel(UserNotification.name)
    private userNotificationModel: Model<UserNotificationDocument>,
    private notificationService: NotificationService,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true })

  async getUserNotification(userId: string) {
    const notifications = await this.userNotificationModel.findOne({ userId })
    return notifications
  }

  async newUserNotification(user: NewUserNotificationDto) {
    const newNotification = await new this.userNotificationModel({
      ...user,
      notificationMark: null,
    }).save()
    return newNotification
  }

  async syncReadNotification(user: UserNotification) {
    let nextMarkNotification = (
      await this.notificationService.getAdjacentNotification(
        user.notificationMark?.toString(),
      )
    )[0]

    if (!nextMarkNotification && !user.notificationMark)
      nextMarkNotification =
        await this.notificationService.getOldestNotification()

    if (user.readIds.includes(nextMarkNotification._id)) {
      user.readIds = user.readIds.filter(
        (val) => val.toString() !== nextMarkNotification._id.toString(),
      )
      user.notificationMark = nextMarkNotification._id
      return await this.syncReadNotification(user)
    }
  }

  async updateReadNotification(id: string, userId: string) {
    const user = await this.userNotificationModel.findById(userId)
    const notification = await this.notificationService.getNotification(id)
    if (!user.readIds.includes(notification._id))
      user.readIds.push(notification._id)
    await this.syncReadNotification(user)
    return await user.save()
  }

  async updateReadNotifications(userId: string) {
    const user = await this.userNotificationModel.findById(userId)
    const latestNotification =
      await this.notificationService.getLatestNotification()
    user.notificationMark = latestNotification._id
    user.readIds = []
    return await user.save()
  }
}
