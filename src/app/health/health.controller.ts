import { Controller, Get } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller('/health')
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  check(): string {
    return this.service.check()
  }
}
