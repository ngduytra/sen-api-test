import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsString } from 'class-validator'
import { IsSolanaAddress } from 'decorators/address.decorator'

export class User {
  @IsSolanaAddress()
  walletAddress: string
  @IsSolanaAddress()
  nftAddress: string
  @IsSolanaAddress()
  snsAddress: string
  @IsString({ each: true })
  appIds: string[]
  @IsSolanaAddress({ each: true })
  aliasAddresses: string[]
}

export class NewUserDto extends OmitType(User, ['walletAddress']) {}
export class UpdateUserDto extends PartialType(NewUserDto) {}
