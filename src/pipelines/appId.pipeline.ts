import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { snakeCase } from 'snake-case'

@Injectable()
export class ParseAppIdPipe implements PipeTransform {
  transform({ name }: { name: string }) {
    try {
      if (!name) throw new Error('Empty app name')
      return snakeCase(name)
    } catch (er: any) {
      throw new BadRequestException(er.message)
    }
  }
}
