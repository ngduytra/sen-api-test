import { Injectable } from '@nestjs/common'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
  getUser(walletAddress: string): any {
    return { walletAddress }
  }

  newUser(user: UserDto): UserDto {
    return { ...user }
  }

  updateUser(user: { walletAddress: string } & Partial<UserDto>): any {
    return { ...user }
  }

  deleteUser(walletAddress: string): any {
    return { walletAddress }
  }
}
