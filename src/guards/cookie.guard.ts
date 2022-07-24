import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { OAuth } from '@sentre/connector'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class CookieGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request>()
    const {
      cookies: { bearer },
    } = request
    if (!bearer) throw new BadRequestException()
    if (!OAuth.verify(bearer)) throw new UnauthorizedException()
    const { publicKey } = OAuth.parse(bearer)
    request.headers.user = publicKey.toBase58()
    return true
  }
}
