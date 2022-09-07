import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Auth } from 'decorators/auth.decorator'
import { CookieGuard } from 'guards/cookie.guard'
import { ParseSolanaAddressPipe } from 'pipelines/address.pipeline'
import { LotteryService } from './lottery.service'

@Controller('/lottery')
export class LotteryController {
  constructor(private readonly service: LotteryService) {}

  @Get('/util/gen-keypair')
  @UseGuards(CookieGuard)
  generateKeypair() {
    const { pubKey, privKey } = this.service.generateKeypair()
    return {
      pubKey: Buffer.from(pubKey).toString('hex'),
      privKey: Buffer.from(privKey).toString('hex'),
    }
  }

  @Get('/util/lottery-pubkey')
  @UseGuards(CookieGuard)
  @UseInterceptors(CacheInterceptor)
  getLotteryPubkey() {
    const pubKey = this.service.getLotteryPubkey()
    return Buffer.from(pubKey).toString('hex')
  }

  @Get('/lucky-number/:ticketAddress')
  @UseGuards(CookieGuard)
  @UseInterceptors(CacheInterceptor)
  async getLuckyNumber(
    @Auth(ParseSolanaAddressPipe) walletAddress: string,
    @Param('ticketAddress', ParseSolanaAddressPipe) ticketAddress,
  ) {
    const { signature, recid, pubKey } = await this.service.getLuckyNumber(
      walletAddress,
      ticketAddress,
    )
    return {
      signature: Buffer.from(signature).toString('hex'),
      recid,
      pubKey: Buffer.from(pubKey).toString('hex'),
    }
  }
}
