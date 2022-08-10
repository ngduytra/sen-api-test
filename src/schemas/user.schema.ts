import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  walletAddress: string

  @Prop({ type: String, default: null })
  nftAddress: string

  @Prop({ type: String, default: null })
  snsAddress: string

  @Prop({ type: [{ type: String }], required: true, default: [] })
  appIds: string[]

  @Prop({ type: Boolean, default: false })
  developerMode: boolean

  @Prop({ type: Date })
  createdAt: Date

  @Prop({ type: Date })
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User).index({
  walletAddress: 1,
})
