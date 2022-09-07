import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from 'config/configuration'
import nacl from 'tweetnacl'
import { privateKeyVerify, publicKeyCreate, ecdsaSign } from 'secp256k1'
import { Connection, PublicKey } from '@solana/web3.js'
import {
  validateInitTicketIx,
  validateOtcIx,
  validatePlatformFeeIx,
} from './lottery.util'

export type Keypair = { pubKey: Uint8Array; privKey: Uint8Array }
export type Signature = {
  signature: Uint8Array
  recid: number
  pubKey: Uint8Array
}

@Injectable()
export class LotteryService {
  constructor(private config: ConfigService<EnvironmentVariables>) {}

  private readonly privKey = this.config.get('lottery.privKey', { infer: true })
  private readonly pubKey = publicKeyCreate(this.privKey)
  private readonly connection = new Connection(
    this.config.get('solana.cluster', { infer: true }),
  )

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

  async getLuckyNumber(ticketAddress: string): Promise<Signature> {
    const ticketPubkey = new PublicKey(ticketAddress)
    // Inexecutable account
    const { executable } = await this.connection.getAccountInfo(ticketPubkey)
    if (executable) throw new Error('Invalid ticket account')
    // Get init tx
    const txIds = await this.connection.getSignaturesForAddress(ticketPubkey)
    const { signature: txId } = txIds[txIds.length - 1]
    const {
      transaction: {
        message: { accountKeys, instructions },
      },
    } = await this.connection.getParsedTransaction(txId, 'confirmed')
    // Check ticket account is a signer
    const index = accountKeys.findIndex(
      ({ pubkey, signer, writable }) =>
        pubkey.equals(ticketPubkey) && signer && writable,
    )
    if (index < 0) throw new Error('Invalid ticket account')
    // Check init ticket instruction
    let checkedOtc = false
    let checkedInitTicket = false
    let checkedPlatformFee = false
    instructions.forEach((instruction) => {
      if ('data' in instruction && 'accounts' in instruction) {
        if (validateOtcIx(instruction)) checkedOtc = true
        if (validateInitTicketIx(ticketPubkey, instruction))
          checkedInitTicket = true
      }
      if ('parsed' in instruction && 'program' in instruction)
        if (validatePlatformFeeIx(instruction)) checkedPlatformFee = true
    })
    if (!checkedOtc) throw new Error('Invalid ticket account')
    if (!checkedInitTicket) throw new Error('Invalid ticket account')
    if (!checkedPlatformFee) throw new Error('Invalid ticket account')

    const msg = new PublicKey(ticketAddress).toBuffer()
    const { signature, recid } = ecdsaSign(msg, this.privKey)
    return { signature, recid, pubKey: this.pubKey }
  }
}
