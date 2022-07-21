import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { User, NewUserDto, UpdateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('/user/:walletAddress')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  getUser(@Param('walletAddress') walletAddress: string): any {
    return this.service.getUser(walletAddress)
  }

  @Put()
  newUser(
    @Param('walletAddress') walletAddress: string,
    @Body() user: NewUserDto,
  ): any {
    return this.service.newUser({ walletAddress, ...user })
  }

  @Post()
  updateUser(
    @Param('walletAddress') walletAddress: string,
    @Body() user: UpdateUserDto,
  ): User {
    return this.service.updateUser({ walletAddress, ...user })
  }

  @Delete()
  deleteUser(@Param('walletAddress') walletAddress: string): any {
    return this.service.deleteUser(walletAddress)
  }
}
