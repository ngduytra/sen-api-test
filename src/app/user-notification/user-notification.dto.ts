import { IsObject, IsOptional } from 'class-validator'
import { Types } from 'mongoose'
import { OmitType } from '@nestjs/mapped-types'

export class UserNotificationDto {
  @IsObject()
  userId: Types.ObjectId

  @IsObject({ each: true })
  @IsOptional()
  readIds: Types.ObjectId[]

  @IsObject()
  @IsOptional()
  notificationMark: Types.ObjectId
}

export class NewUserNotificationDto extends OmitType(UserNotificationDto, [
  'readIds',
  'notificationMark',
]) {}
