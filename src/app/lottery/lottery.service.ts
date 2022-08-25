import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import BN from 'bn.js'
import { EnvironmentVariables } from 'config/configuration'
import nacl from 'tweetnacl'

@Injectable()
export class LotteryService {
  constructor(private config: ConfigService<EnvironmentVariables>) {}

  rand(): string {
    const r = new BN(nacl.randomBytes(64))
      .mod(this.config.get('lottery.max', { infer: true }))
      .toString(10)
    return r
  }
}
