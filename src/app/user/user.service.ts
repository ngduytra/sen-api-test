import { Injectable } from '@nestjs/common'
import { User } from './user.dto'

@Injectable()
export class UserService {
  getUser(walletAddress: string): any {
    return { walletAddress }
  }

  newUser(user: User): User {
    return { ...user }
  }

  updateUser(user: { walletAddress: string } & Partial<User>): any {
    return { ...user }
  }

  deleteUser(walletAddress: string): any {
    return { walletAddress }
  }
}
