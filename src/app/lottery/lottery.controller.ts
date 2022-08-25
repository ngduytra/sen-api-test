import { Controller, Get } from '@nestjs/common'
import { LotteryService } from './lottery.service'

@Controller('lottery')
export class LotteryController {
  constructor(private readonly service: LotteryService) {}

  @Get('/rand')
  rand() {
    return this.service.rand()
  }
}
