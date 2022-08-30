import {
  Injectable,
  Inject,
  CacheOptionsFactory,
  CacheModuleOptions,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose'
import redisStore from 'cache-manager-redis-store'

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService
  public createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.config.get('mongodb.uri', { infer: true }),
    }
  }
}

@Injectable()
export class RedisCacheConfigService implements CacheOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService
  public createCacheOptions(): CacheModuleOptions {
    return {
      store: redisStore,
      host: this.config.get('redis.host', { infer: true }),
      port: this.config.get('redis.port', { infer: true }),
      ttl: this.config.get('redis.ttl', { infer: true }),
      isCacheableValue: (value) => value !== undefined,
    }
  }
}
