import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { EnvironmentVariables } from 'config/configuration'
import { Model } from 'mongoose'
import { MAX_LIMIT } from 'pipelines/limit.pipe'
import { MIN_OFFSET } from 'pipelines/offset.pipe'
import { Dapp, DappDocument } from 'schemas/dapp.schema'
import { DappDto, UpdateDappDto, VerifyDappDto } from './dapp.dto'

@Injectable()
export class DappService {
  constructor(
    @InjectModel(Dapp.name) private dappModel: Model<DappDocument>,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  dbProjection = this.config.get('mongodb.projection', { infer: true })

  async getDapps(search: string, offset = MIN_OFFSET, limit = MAX_LIMIT) {
    const filter = search ? { $text: { $search: search } } : {}
    const dapps = await this.dappModel
      .find(filter, this.dbProjection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec()
    return dapps
  }

  async getDapp(appId: string) {
    const dapp = await this.dappModel.findOne({ appId }, this.dbProjection)
    return dapp
  }

  async newDapp(dapp: DappDto) {
    const newDapp = await new this.dappModel({ ...dapp }).save()
    return newDapp
  }

  async verifiedDapp({ appId, verified = true }: VerifyDappDto) {
    const verifiedDapp = await this.dappModel.findOneAndUpdate(
      { appId },
      { verified },
      { new: true, upsert: true },
    )
    return verifiedDapp
  }

  async updateDapp(walletAddress: string, dapp: UpdateDappDto) {
    const updatedDapp = await this.dappModel.findOneAndUpdate(
      { appId: dapp.appId, 'author.walletAddress': walletAddress },
      { ...dapp },
      { new: true, upsert: true },
    )
    return updatedDapp
  }

  async deleteDapp(walletAddress: string, appId: string) {
    const deletedDapp = await this.dappModel.findOneAndDelete({
      appId,
      'author.walletAddress': walletAddress,
    })
    return deletedDapp
  }
}
