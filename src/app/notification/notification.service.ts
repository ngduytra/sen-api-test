import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { Model } from 'mongoose'

import { Notification, NotificationDocument } from 'schemas/notification.schema'
import { MAX_LIMIT } from 'pipelines/limit.pipe'
import { MIN_OFFSET } from 'pipelines/offset.pipe'
import { NotificationDto, UpdateNotificationDto } from './notification.dto'
import { EnvironmentVariables } from 'config/configuration'

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true })

  async getNotifications({
    filter = {},
    search = '',
    offset = MIN_OFFSET,
    limit = MAX_LIMIT,
  }: {
    filter?: object
    search?: string
    offset?: number
    limit?: number
  }) {
    const cond = search ? { ...filter, $text: { $search: search } } : filter
    const notifications = await this.notificationModel
      .find(cond)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec()

    return notifications
  }

  async getNotification(id: string) {
    return await this.notificationModel.findById(id).exec()
  }

  async updateNotification(_id: string, data: UpdateNotificationDto) {
    const newNotification = await this.notificationModel
      .findOneAndUpdate({ _id }, data, { new: true })
      .exec()
    return newNotification
  }

  async updateNotifications(data: NotificationDto) {
    const newNotifications = await this.notificationModel
      .updateMany({}, data, { new: true, runValidators: true })
      .exec()
    return newNotifications
  }

  async createNotification(notification: NotificationDto) {
    const newNotification = await new this.notificationModel({
      ...notification,
      time: new Date(),
    }).save()
    return newNotification
  }

  async getOldestNotification() {
    return await this.notificationModel.findOne({}).sort({ createdAt: 1 })
  }

  async getLatestNotification() {
    return await this.notificationModel.findOne({}).sort({ createdAt: -1 })
  }

  async getAdjacentNotification(recordId?: string, limit = 1) {
    if (!recordId) return []
    return await this.notificationModel
      .find({ _id: { $gt: recordId } })
      .sort({ _id: 1 })
      .limit(limit)
      .exec()
  }
}
