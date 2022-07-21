import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import morgan from 'morgan'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly format: string = 'combined') {}
  use(req: Request, res: Response, next: NextFunction) {
    morgan(this.format)(req, res, next)
  }
}
