import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export type UserNotificationDocument = UserNotification & Document
export const ROLE = ['admin', 'user', 'editor']

@Schema()
export class UserNotification {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }], default: [] })
  readIds: Types.ObjectId[]

  @Prop({ type: Types.ObjectId })
  notificationMark: Types.ObjectId
}

export const UserNotificationSchema =
  SchemaFactory.createForClass(UserNotification)
