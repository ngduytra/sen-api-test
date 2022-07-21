import { OmitType, PartialType } from '@nestjs/mapped-types'

export class User {
  walletAddress: string
  nftAddress: string
  snsAddress: string
  appIds: string[]
  aliasAddresses: string[]
}

export class NewUserDto extends OmitType(User, ['walletAddress']) {}
export class UpdateUserDto extends PartialType(NewUserDto) {}
