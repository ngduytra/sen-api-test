import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { OAuth } from '@sentre/connector'
import { Request, Response } from 'express'
import { Observable } from 'rxjs'

const BEARER_PREFIX = 'Bearer '
const parseBearerToken = (authorization: string): string | undefined => {
  if (!authorization) return undefined
  if (!authorization.startsWith(BEARER_PREFIX)) return undefined
  return authorization.replace(BEARER_PREFIX, '')
}
const parseMaxAge = (createdDate: number, ttl: number) => {
  if (!createdDate || !ttl) return 0
  const endDate = Math.floor((createdDate + ttl) * 1000)
  const maxAge = endDate - Date.now()
  return maxAge
}

@Injectable()
export class JSTGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request>()
    const response = http.getResponse<Response>()
    const {
      headers: { authorization },
    } = request
    const bearer = parseBearerToken(authorization)
    if (!bearer) throw new BadRequestException()
    if (!OAuth.verify(bearer)) throw new UnauthorizedException()
    const { publicKey, jst } = OAuth.parse(bearer)
    request.headers.user = publicKey.toBase58()
    response.cookie('bearer', bearer, {
      httpOnly: true,
      maxAge: parseMaxAge(jst.createdDate, jst.ttl),
    })
    return true
  }
}
