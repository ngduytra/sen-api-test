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
import { Auth } from 'decorators/auth.decorator'
import { JSTGuard } from 'guards/jst.guard'
import { CookieGuard } from 'guards/cookie.guard'
import { ParseSolanaAddressPipe } from 'pipelines/address.pipeline'
import { NewUserDto, UpdateUserDto } from './user.dto'
import { UserService } from './user.service'
import { UserDocument } from 'schemas/user.schema'
import { Response } from 'express'

@Controller('/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/auth')
  @UseGuards(JSTGuard)
  authUser(@Auth(ParseSolanaAddressPipe) walletAddress: string): {
    walletAddress: string
  } {
    return { walletAddress }
  }

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
    res.clearCookie('bearer', {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      maxAge: 0,
    })
    return { walletAddress }
  }

  @Get()
  @UseGuards(CookieGuard)
  async getUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
  ): Promise<UserDocument> {
    return this.service.getUser(walletAddress)
  }

  @Put()
  @UseGuards(CookieGuard)
  async newUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() user: NewUserDto,
  ): Promise<UserDocument> {
    return this.service.newUser({ walletAddress, ...user })
  }

  @Post()
  @UseGuards(CookieGuard)
  async updateUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.service.updateUser({ walletAddress, ...user })
  }

  @Delete()
  @UseGuards(CookieGuard)
  async deleteUser(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
  ): Promise<UserDocument> {
    return this.service.deleteUser(walletAddress)
  }
}
