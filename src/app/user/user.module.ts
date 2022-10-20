import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { NotificationService } from 'app/notification/notification.service'
import { UserNotificationService } from 'app/user-notification/user-notification.service'
import { NotificationSchema, Notification } from 'schemas/notification.schema'
import {
  UserNotification,
  UserNotificationSchema,
} from 'schemas/user-notification.schema'
import { User, UserSchema } from 'schemas/user.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserNotificationService, NotificationService],
})
export class UserModule {}
