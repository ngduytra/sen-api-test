import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { UserNotificationService } from 'app/user-notification/user-notification.service'
import { Model } from 'mongoose'
import { User, UserDocument } from 'schemas/user.schema'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userNotificationService: UserNotificationService,
  ) {}

  async getUser(walletAddress: string) {
    const user = await this.userModel.findOne({ walletAddress })
    return user
  }

  async newUser(user: UserDto) {
    const newUser = await new this.userModel({ ...user }).save()
    await this.userNotificationService.newUserNotification({
      userId: newUser._id,
    })
    return newUser
  }

  async updateUser(user: { walletAddress: string } & Partial<UserDto>) {
    return await this.userModel.findOneAndUpdate(
      { walletAddress: user.walletAddress },
      { ...user },
      { new: true, upsert: true },
    )
  }

  async deleteUser(walletAddress: string) {
    const deletedUser = await this.userModel.findOneAndDelete({ walletAddress })
    return deletedUser
  }
}
