import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'

@Injectable()
export class ParseSolanaAddressPipe implements PipeTransform {
  transform(value: any) {
    try {
      if (!value) throw new Error('Empty address')
      new PublicKey(value)
    } catch (er: any) {
      throw new BadRequestException(er.message)
    }
    return value
  }
}
