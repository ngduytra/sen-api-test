import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health/health.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
