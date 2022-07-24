import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class RefererGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request>()
    const {
      headers: { host },
    } = request
    console.log('host', host)
    return true
  }
}
