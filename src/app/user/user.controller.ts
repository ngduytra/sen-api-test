import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { Auth } from 'decorators/auth.decorator'
import { JSTGuard } from 'guards/jst.guard'
import { RefererGuard } from 'guards/referer.gaurd'
import { CookieGuard } from 'guards/cookie.guard'
import { ParseAddressPipe } from 'pipelines/address.pipeline'
import { User, NewUserDto, UpdateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/auth')
  @UseGuards(JSTGuard)
  authUser(@Auth(ParseAddressPipe) walletAddress: string): any {
    return this.service.getUser(walletAddress)
  }

  @Get()
  @UseGuards(CookieGuard)
  getUser(@Auth(ParseAddressPipe) walletAddress: string): any {
    return this.service.getUser(walletAddress)
  }

  @Put()
  @UseGuards(CookieGuard)
  newUser(
    @Auth(ParseAddressPipe) walletAddress: string,
    @Body() user: NewUserDto,
  ): any {
    return this.service.newUser({ walletAddress, ...user })
  }

  @Post()
  @UseGuards(CookieGuard, RefererGuard)
  updateUser(
    @Auth(ParseAddressPipe) walletAddress: string,
    @Body() user: UpdateUserDto,
  ): User {
    return this.service.updateUser({ walletAddress, ...user })
  }

  @Delete()
  @UseGuards(CookieGuard)
  deleteUser(@Auth(ParseAddressPipe) walletAddress: string): any {
    return this.service.deleteUser(walletAddress)
  }
}
