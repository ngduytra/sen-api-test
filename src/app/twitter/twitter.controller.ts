import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { CookieGuard } from 'guards/cookie.guard'
import { TwitterService } from './twitter.service'

@Controller('/twitter')
export class TwitterController {
  constructor(private readonly service: TwitterService) {}

  @Get('/mentions/:searchKey')
  @UseGuards(CookieGuard)
  getMentions(@Param('searchKey') searchKey: string) {
    return this.service.getMentions(searchKey)
  }
}
