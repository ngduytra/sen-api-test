import {
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js'
import configuration from 'config/configuration'
import { ixDiscriminator } from 'helpers/util'

export const validateInitTicketIx = (
  ticketPubkey: PublicKey,
  { programId, data, accounts }: PartiallyDecodedInstruction,
) => {
  if (!configuration().lottery.programId.equals(programId)) return false
  if (!data.startsWith(ixDiscriminator('initializeTicket'))) return false
  if (accounts.findIndex((account) => account.equals(ticketPubkey)) < 0)
    return false
  return true
}

export const validateOtcIx = ({ programId }: PartiallyDecodedInstruction) => {
  if (!configuration().jupiter.programId.equals(programId)) return false
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
