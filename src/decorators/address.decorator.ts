import { PublicKey } from '@solana/web3.js'
import {
  buildMessage,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'

export function IsSolanaAddress(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSolanaAddress',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            new PublicKey(value)
            return true
          } catch (er) {
            return false
          }
        },
        defaultMessage: buildMessage(
          () =>
            'Invalid Solana Address. The addresses must be base58 public keys.',
          validationOptions,
        ),
      },
    })
  }
}
