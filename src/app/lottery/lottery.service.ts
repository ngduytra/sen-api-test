import { AnchorProvider, Wallet } from '@project-serum/anchor'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EnvironmentVariables } from 'config/configuration'
import nacl from 'tweetnacl'
import { privateKeyVerify, publicKeyCreate, ecdsaSign } from 'secp256k1'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { validateInitTicketIx, validateMagicEdenIx } from './lottery.util'
import LuckyWheelCore from '@sentre/lucky-wheel-core'

export type Secp256k1Keypair = { pubKey: Uint8Array; privKey: Uint8Array }
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
  private readonly luckyWheelCore = new LuckyWheelCore(
    new AnchorProvider(
      this.connection,
      new Wallet(new Keypair()), // Dummy wallet
      { commitment: 'confirmed' },
    ),
    this.config.get('lottery.programId', { infer: true }),
  )

  private signLuckyTicket(msg: Buffer) {
    const { signature, recid } = ecdsaSign(msg, this.privKey)
    return { signature, recid, pubKey: this.pubKey }
  }

  generateKeypair(): Secp256k1Keypair {
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

  async getLuckyNumber(
    walletAddress: string,
    ticketAddress: string,
  ): Promise<Signature> {
    const walletPubkey = new PublicKey(walletAddress)
    const ticketPubkey = new PublicKey(ticketAddress)
    const msg = ticketPubkey.toBuffer()
    // Inexecutable account
    const { executable } = await this.connection.getAccountInfo(ticketPubkey)
    if (executable) throw new Error('Invalid ticket account')
    // Check verified ticket
    const { verified } = await this.luckyWheelCore.account.ticket.fetch(
      ticketPubkey,
    )
    if (verified) return this.signLuckyTicket(msg)
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
    let checkedInitTicket = false
    instructions.forEach((instruction) => {
      if ('data' in instruction && 'accounts' in instruction) {
        if (validateInitTicketIx(ticketPubkey, instruction))
          checkedInitTicket = true
      }
    })
    if (!checkedInitTicket) throw new Error('Invalid ticket account')
    // Check the precedent service
    const serviceTxIds = await this.connection.getSignaturesForAddress(
      walletPubkey,
      { before: txId, limit: 1 },
    )
    const { signature: serviceTxId } = serviceTxIds[0] || {}
    if (!serviceTxId) throw new Error('Invalid ticket account')
    const {
      transaction: {
        message: {
          accountKeys: serviceAccountKeys,
          instructions: serviceInstructions,
        },
      },
    } = await this.connection.getParsedTransaction(serviceTxId, 'confirmed')
    const serviceIndex = serviceAccountKeys.findIndex(
      ({ pubkey, signer, writable }) =>
        pubkey.equals(walletPubkey) && signer && writable,
    )
    if (serviceIndex < 0) throw new Error('Invalid ticket account')
    let checkedMagicEden = false
    serviceInstructions.forEach((instruction) => {
      if ('data' in instruction && 'accounts' in instruction) {
        if (validateMagicEdenIx(instruction)) checkedMagicEden = true
      }
    })
    if (!checkedMagicEden) throw new Error('Invalid ticket account')

    return this.signLuckyTicket(msg)
  }
}
