import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { IsSolanaAddress } from 'decorators/address.decorator'

export class UserDto {
  @IsSolanaAddress()
  walletAddress: string

  @IsSolanaAddress()
  @IsOptional()
  nftAddress: string

  @IsSolanaAddress()
  @IsOptional()
  snsAddress: string

  @IsString({ each: true })
  appIds: string[]

  @IsBoolean()
  @IsOptional()
  developerMode: boolean
}

export class NewUserDto extends OmitType(UserDto, ['walletAddress']) {}
export class UpdateUserDto extends PartialType(NewUserDto) {}
