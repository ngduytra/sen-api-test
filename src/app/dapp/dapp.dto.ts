import { OmitType, PickType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'
import { IsSolanaAddress } from 'decorators/address.decorator'

export class DappAuthorDto {
  @IsSolanaAddress()
  walletAddress: string

  @IsString()
  name: string

  @IsString()
  email: string // Even the field name is "email", we still accept discord, twitter links
}

export class DappDto {
  @IsString()
  appId: string

  @IsUrl()
  url: string

  @IsString()
  name: string

  @Type(() => DappAuthorDto)
  @ValidateNested()
  author: DappAuthorDto

  @IsString({ each: true })
  tags: string[]

  @IsString()
  description: string

  @IsBoolean()
  @IsOptional()
  verified: boolean
}

export class NewDappDto extends OmitType(DappDto, ['appId', 'verified']) {}
export class UpdateDappDto extends OmitType(DappDto, ['name', 'verified']) {}
export class VerifyDappDto extends PickType(DappDto, ['appId', 'verified']) {}
