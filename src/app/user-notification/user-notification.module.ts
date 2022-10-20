import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import {
  UserNotificationSchema,
  UserNotification,
} from 'schemas/user-notification.schema'

import { UserNotificationController } from './user-notification.controller'
import { UserNotificationService } from './user-notification.service'
import { Notification, NotificationSchema } from 'schemas/notification.schema'
import { NotificationService } from 'app/notification/notification.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserNotification.name, schema: UserNotificationSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [UserNotificationController],
  providers: [UserNotificationService, NotificationService],
})
export class UserNotificationModule {}
