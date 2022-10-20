import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

export type NotificationDocument = Notification & Document

export const NOTIFICATION_TYPE = ['sentre']

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true, enum: NOTIFICATION_TYPE })
  type: string

  @Prop({ type: Types.ObjectId, required: true })
  sender: Types.ObjectId

  @Prop({ type: String })
  thumbnail: string

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  content: string

  @Prop({ type: String, default: '' })
  action: string

  @Prop({ type: Date, required: true })
  broadcastedAt: Date
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
