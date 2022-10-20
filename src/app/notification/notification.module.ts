import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { NotificationSchema, Notification } from 'schemas/notification.schema'
import { EventsService } from '../events.service'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, EventsService],
})
export class NotificationModule {}
