import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from 'app/app.module'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: [/^(http)[s]?:\/\/(localhost)(:[0-9]+)$/, 'https://hub.sentre.io'],
    credentials: true,
  })
  app.use(cookieParser())
  app.use(morgan('tiny'))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(3001)
}
bootstrap()
