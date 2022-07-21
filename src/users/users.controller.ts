import { Controller, Delete, Get, Post, Put } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  getUser(): any {
    return this.service.getUser()
  }

  @Post()
  newUser(): any {
    return this.service.newUser()
  }

  @Put()
  updateUser(): any {
    return this.service.updateUser()
  }

  @Delete()
  deleteUser(): any {
    return this.service.deleteUser()
  }
}
