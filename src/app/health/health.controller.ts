import { Get, Controller, UseGuards } from '@nestjs/common'
import { CookieGuard } from 'guards/cookie.guard'
import { HealthService } from './health.service'

@Controller('/health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  checkConnection(): string {
    return this.service.check()
  }

  @Get('/cookie')
  @UseGuards(CookieGuard)
  checkCookie(): string {
    return this.service.check()
  }
}
