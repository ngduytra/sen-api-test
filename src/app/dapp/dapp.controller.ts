import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { Auth } from 'decorators/auth.decorator'
import { AdminGuard } from 'guards/admin.guard'
import { CookieGuard } from 'guards/cookie.guard'
import { ParseSolanaAddressPipe } from 'pipelines/address.pipeline'
import { ParseAppIdPipe } from 'pipelines/appId.pipeline'
import { ParseLimitPipe } from 'pipelines/limit.pipe'
import { ParseOffsetPipe } from 'pipelines/offset.pipe'
import { NewDappDto, UpdateDappDto, VerifyDappDto } from './dapp.dto'
import { DappService } from './dapp.service'

@Controller('/dapp')
export class DappController {
  constructor(private readonly service: DappService) {}

  @Get()
  async getDapps(
    @Query('offset', ParseOffsetPipe) offset: number,
    @Query('limit', ParseLimitPipe) limit: number,
    @Query('search') search = '',
  ) {
    return this.service.getDapps(search, offset, limit)
  }

  @Get('/:appId')
  async getCollection(@Param('appId') appId: string) {
    if (!appId) throw new Error('Invalid app ID')
    return await this.service.getDapp(appId)
  }

  @Put()
  @UseGuards(CookieGuard)
  async newDapp(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body(ParseAppIdPipe) appId: string,
    @Body() dapp: NewDappDto,
  ) {
    const author = { ...dapp.author, walletAddress }
    return this.service.newDapp({ ...dapp, appId, author, verified: false })
  }

  @Post()
  @UseGuards(CookieGuard)
  async updateDapp(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body() dapp: UpdateDappDto,
  ) {
    return this.service.updateDapp(walletAddress, dapp)
  }

  @Delete()
  @UseGuards(CookieGuard)
  async deleteDapp(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Body('appId') appId: string,
  ) {
    return this.service.deleteDapp(walletAddress, appId)
  }

  @Post('/verify')
  @UseGuards(CookieGuard, AdminGuard)
  async verifyDapp(@Body() dapp: VerifyDappDto) {
    return this.service.verifiedDapp(dapp)
  }
}
