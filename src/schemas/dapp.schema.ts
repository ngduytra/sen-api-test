import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type DappDocument = Dapp & Document

export class DappAuthor {
  @Prop({ type: String, required: true })
  walletAddress: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  email: string
}

@Schema({ timestamps: true })
export class Dapp {
  @Prop({ type: String, required: true, unique: true })
  appId: string

  @Prop({ type: String, required: true, unique: true })
  url: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: DappAuthor, required: true })
  author: DappAuthor

  @Prop({ type: [{ type: String }], required: true, default: [] })
  tags: string[]

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: Boolean, default: false })
  verified: boolean

  @Prop({ type: Date })
  createdAt: Date

  @Prop({ type: Date })
  updatedAt: Date
}

export const DappSchema = SchemaFactory.createForClass(Dapp).index({
  appId: 1,
  url: 1,
  name: 'text',
  description: 'text',
  tags: 'text',
})
