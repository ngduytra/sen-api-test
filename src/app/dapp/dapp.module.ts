import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Dapp, DappSchema } from 'schemas/dapp.schema'
import { DappController } from './dapp.controller'
import { DappService } from './dapp.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dapp.name, schema: DappSchema }]),
  ],
  controllers: [DappController],
  providers: [DappService],
})
export class DappModule {}
