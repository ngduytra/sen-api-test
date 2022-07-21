import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { Auth } from 'decorators/auth.decorator'
import { SessionGuard } from 'guards/session.guard'
import { ParseAddressPipe } from 'pipelines/address.pipeline'
import { User, NewUserDto, UpdateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('/user/:walletAddress')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @UseGuards(SessionGuard)
  getUser(@Auth(ParseAddressPipe) walletAddress: string): any {
    return this.service.getUser(walletAddress)
  }

  @Put()
  @UseGuards(SessionGuard)
  newUser(
    @Auth(ParseAddressPipe) walletAddress: string,
    @Body() user: NewUserDto,
  ): any {
    return this.service.newUser({ walletAddress, ...user })
  }

  @Post()
  @UseGuards(SessionGuard)
  updateUser(
    @Auth(ParseAddressPipe) walletAddress: string,
    @Body() user: UpdateUserDto,
  ): User {
    return this.service.updateUser({ walletAddress, ...user })
  }

  @Delete()
  @UseGuards(SessionGuard)
  deleteUser(@Auth(ParseAddressPipe) walletAddress: string): any {
    return this.service.deleteUser(walletAddress)
  }
}
