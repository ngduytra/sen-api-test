import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'
import { PublicKey } from '@solana/web3.js'

@Injectable()
export class ParseAddressPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (!value) throw new Error('Empty address')
      new PublicKey(value)
    } catch (er: any) {
      throw new BadRequestException(er.message)
    }
    return value
  }
}
