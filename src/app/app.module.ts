import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseConfigService, RedisCacheConfigService } from './app.service'
import { HealthModule } from './health/health.module'
import { UserModule } from './user/user.module'
import { LotteryModule } from './lottery/lottery.module'
import { DappModule } from './dapp/dapp.module'
import { TwitterModule } from './twitter/twitter.module'
import { NotificationModule } from './notification/notification.module'
import { UserNotificationModule } from './user-notification/user-notification.module'
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
    DappModule,
    TwitterModule,
    NotificationModule,
    UserNotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
