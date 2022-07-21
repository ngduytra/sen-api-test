import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from 'app/app.module'
import morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(morgan('tiny'))
  await app.listen(3000)
}
bootstrap()
