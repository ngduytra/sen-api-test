import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from 'schemas/user.schema'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(walletAddress: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ walletAddress })
    return user
  }

  async newUser(user: UserDto): Promise<UserDocument> {
    const newUser = await new this.userModel({ ...user }).save()
    return newUser
  }

  async updateUser(
    user: { walletAddress: string } & Partial<UserDto>,
  ): Promise<UserDocument> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { walletAddress: user.walletAddress },
      { ...user },
      { new: true, upsert: true },
    )
    return updatedUser
  }

  async deleteUser(walletAddress: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findOneAndDelete({ walletAddress })
    return deletedUser
  }
}
