import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PublicKey } from '@solana/web3.js'
import { EnvironmentVariables } from 'config/configuration'
import { Request } from 'express'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private config: ConfigService<EnvironmentVariables>) {}

  private readonly admins = this.config.get('server.adminPubkeys', {
    infer: true,
  })

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp()
    const request = http.getRequest<Request>()
    const addr = request.headers.user
    if (!addr) throw new BadRequestException()
    const pubkey = new PublicKey(addr)
    const index = this.admins.findIndex((admin) => admin.equals(pubkey))
    if (index < 0) throw new UnauthorizedException()
    return true
  }
}
