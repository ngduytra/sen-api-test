import {
  ParsedInstruction,
  ParsedMessageAccount,
  PartiallyDecodedInstruction,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import configuration from 'config/configuration'
import { ixDiscriminator } from 'helpers/util'

export const isSigner = (
  account: PublicKey,
  accountKeys: ParsedMessageAccount[],
) => {
  const index = accountKeys.findIndex(
    ({ pubkey, signer }) => pubkey.equals(account) && signer,
  )
  return index >= 0
}

export const isWritable = (
  account: PublicKey,
  accountKeys: ParsedMessageAccount[],
) => {
  const index = accountKeys.findIndex(
    ({ pubkey, writable }) => pubkey.equals(account) && writable,
  )
  return index >= 0
}

export const isInitTicketIx = ({
  programId,
  data,
}: PartiallyDecodedInstruction) => {
  if (!configuration().lottery.programId.equals(programId)) return false
  if (!data.startsWith(ixDiscriminator('initializeTicket'))) return false
  return true
}

export const validateInitTicketIx = (
  ticketPubkey: PublicKey,
  { programId, data, accounts }: PartiallyDecodedInstruction,
) => {
  if (!isInitTicketIx({ programId, data, accounts })) return false
  if (accounts.findIndex((account) => account.equals(ticketPubkey)) < 0)
    return false
  return true
}

export const validateMagicEdenIx = ({
  programId,
  accounts,
}: PartiallyDecodedInstruction) => {
  if (!configuration().me.programId.equals(programId)) return false
  if (
    accounts.findIndex((account) =>
      account.equals(configuration().lottery.taxmanPubkey),
    ) < 0
  )
    return false
  return true
}

export const validatePlatformFeeIx = ({
  programId,
  program,
  parsed,
}: ParsedInstruction) => {
  if (!SystemProgram.programId.equals(programId)) return false
  if (program !== 'system') return false
  if (parsed.type !== 'transfer') return false
  if (
    parsed.info?.destination !== configuration().lottery.taxmanPubkey.toString()
  )
    return false
  if (parsed.info?.lamports < 5000) return false
  return true
}
