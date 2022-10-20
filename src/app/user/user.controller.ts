import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'

import { Auth } from 'decorators/auth.decorator'
import { clearCookie, JSTGuard } from 'guards/jst.guard'
import { CookieGuard } from 'guards/cookie.guard'
import { ParseSolanaAddressPipe } from 'pipelines/address.pipeline'
import { NewUserDto, UpdateUserDto } from './user.dto'
import { UserService } from './user.service'
import { UserDocument } from 'schemas/user.schema'

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/login')
  @UseGuards(JSTGuard)
  login(@Auth(ParseSolanaAddressPipe) walletAddress: string): {
    walletAddress: string
  } {
    return { walletAddress }
  }

  @Get('/logout')
  @UseGuards(CookieGuard)
  logout(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Res({ passthrough: true }) res: Response,
  ): {
    walletAddress: string
  } {
    clearCookie(res)
    return { walletAddress }
  }

  @Get()
  @UseGuards(CookieGuard)
  async getUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
  ): Promise<UserDocument> {
    return this.userService.getUser(walletAddress)
  }

  @Put()
  @UseGuards(CookieGuard)
  async newUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() user: NewUserDto,
  ): Promise<UserDocument> {
    return this.userService.newUser({ walletAddress, ...user })
  }

  @Post()
  @UseGuards(CookieGuard)
  async updateUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userService.updateUser({ walletAddress, ...user })
  }

  @Delete()
  @UseGuards(CookieGuard)
  async deleteUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
  ): Promise<UserDocument> {
    return this.userService.deleteUser(walletAddress)
  }
}
