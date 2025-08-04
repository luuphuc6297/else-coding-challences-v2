import {Logger, VersioningType} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {NestApplication, NestFactory} from '@nestjs/core'
import {useContainer} from 'class-validator'
import {AppModule} from 'src/app/app.module'
import swaggerInit from './swagger'

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const databaseUri = configService.get<string>('database.host')!
  const env = configService.get<string>('app.env')!
  const host = configService.get<string>('app.http.host')!
  const port = configService.get<number>('app.http.port')!
  const globalPrefix = configService.get<string>('app.globalPrefix')!
  const versioningPrefix = configService.get<string>('app.versioning.prefix')!
  const version = configService.get<string>('app.versioning.version')!

  // enable
  const httpEnable = configService.get<boolean>('app.http.enable')!
  const versionEnable = configService.get<string>('app.versioning.enable')!
  const jobEnable = configService.get<boolean>('app.jobEnable')!

  const logger = new Logger()
  process.env.NODE_ENV = env

  // Global
  app.setGlobalPrefix(globalPrefix)
  useContainer(app.select(AppModule), {fallbackOnErrors: true})

  // Versioning
  if (versionEnable) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: version,
      prefix: versioningPrefix,
    })
  }

  // Swagger
  await swaggerInit(app)

  // Listen
  await app.listen(port, host)

  logger.log(`==========================================================`)

  logger.log(`Environment: ${env}`, 'NestApplication')

  logger.log(`==========================================================`)

  logger.log(`Job is ${jobEnable}`, 'NestApplication')
  logger.log(`Http is ${httpEnable}, ${httpEnable ? 'routes registered' : 'no routes registered'}`, 'NestApplication')
  logger.log(`Http versioning is ${versionEnable}`, 'NestApplication')

  logger.log(`Http Server running on ${await app.getUrl()}`, 'NestApplication')
  logger.log(`Database uri ${databaseUri}`, 'NestApplication')

  logger.log(`==========================================================`)
}
bootstrap()
