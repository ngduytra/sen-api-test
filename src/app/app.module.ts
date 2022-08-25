import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseConfigService, RedisCacheConfigService } from './app.service'
import { HealthModule } from './health/health.module'
import { UserModule } from './user/user.module'
import { LotteryModule } from './lottery/lottery.module'
import configuration from 'config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: RedisCacheConfigService,
    }),
    ScheduleModule.forRoot(),
    HealthModule,
    UserModule,
    LotteryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
