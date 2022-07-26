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
import { CookieGuard } from 'guards/cookie.guard'
import { ParseSolanaAddressPipe } from 'pipelines/address.pipeline'
import { UserDto, NewUserDto, UpdateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/auth')
  @UseGuards(JSTGuard)
  authUser(@Auth(ParseSolanaAddressPipe) walletAddress: string): any {
    return this.service.getUser(walletAddress)
  }

  @Get()
  @UseGuards(CookieGuard)
  getUser(@Auth(ParseSolanaAddressPipe) walletAddress: string): any {
    return this.service.getUser(walletAddress)
  }

  @Put()
  @UseGuards(CookieGuard)
  newUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() user: NewUserDto,
  ): any {
    return this.service.newUser({ walletAddress, ...user })
  }

  @Post()
  @UseGuards(CookieGuard)
  updateUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() user: UpdateUserDto,
  ): UserDto {
    console.log(user)
    return this.service.updateUser({ walletAddress, ...user })
  }

  @Delete()
  @UseGuards(CookieGuard)
  deleteUser(@Auth(ParseSolanaAddressPipe) walletAddress: string): any {
    return this.service.deleteUser(walletAddress)
  }
}
