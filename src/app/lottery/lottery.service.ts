import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from 'config/configuration'
import nacl from 'tweetnacl'
import { privateKeyVerify, publicKeyCreate, ecdsaSign } from 'secp256k1'
import { PublicKey } from '@solana/web3.js'

export type Keypair = { pubKey: Uint8Array; privKey: Uint8Array }
export type Signature = {
  signature: Uint8Array
  recid: number
  pubKey: Uint8Array
}

@Injectable()
export class LotteryService {
  constructor(private config: ConfigService<EnvironmentVariables>) {}

  private privKey = this.config.get('lottery.privKey', { infer: true })
  readonly pubKey = publicKeyCreate(this.privKey)

  generateKeypair(): Keypair {
    let privKey: Uint8Array
    do {
      privKey = nacl.randomBytes(32)
    } while (!privateKeyVerify(privKey))
    const pubKey = publicKeyCreate(privKey)
    return { pubKey, privKey }
  }

  getLotteryPubkey(): Uint8Array {
    return this.pubKey
  }

  getLuckyNumber(ticketAddress: string): Signature {
    const msg = new PublicKey(ticketAddress).toBuffer()
    const { signature, recid } = ecdsaSign(msg, this.privKey)
    return { signature, recid, pubKey: this.pubKey }
  }
}
