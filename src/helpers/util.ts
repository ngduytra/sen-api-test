import { snakeCase } from 'snake-case'
import { enc, SHA256 } from 'crypto-js'
import { encode } from 'bs58'

const DISCRIMINATOR_SIZE = 8

export const ixDiscriminator = (ixName: string) => {
  const name = snakeCase(ixName)
  const preimage = `global:${name}`
  const hash = Buffer.from(SHA256(preimage).toString(enc.Hex), 'hex')
  const discriminator = hash.slice(0, DISCRIMINATOR_SIZE)
  return encode(discriminator)
}
