import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common'
import { TwitterService } from './twitter.service'

@Controller('/twitter')
export class TwitterController {
  constructor(private readonly service: TwitterService) {}

  @Get('/mentions/:searchKey')
  @UseInterceptors(CacheInterceptor)
  getMentions(@Param('searchKey') searchKey: string) {
    return this.service.getMentions(searchKey)
  }
}
