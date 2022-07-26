import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose'

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService

  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get<string>('DATABASE_URI'),
    }
  }
}
