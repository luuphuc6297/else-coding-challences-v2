import {IRequestApp} from '@infras/request/interfaces/request.interface'
import {Injectable, NestMiddleware} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {NextFunction, Response} from 'express'

@Injectable()
export class RequestVersionMiddleware implements NestMiddleware {
  private readonly versioningEnable: boolean

  private readonly versioningGlobalPrefix: string
  private readonly versioningPrefix: string
  private readonly versioningVersion: string

  private readonly repoVersion: string

  constructor(private readonly configService: ConfigService) {
    this.versioningGlobalPrefix = this.configService.get<string>('app.globalPrefix') ?? 'api'
    this.versioningEnable = this.configService.get<boolean>('app.versioning.enable') ?? false
    this.versioningPrefix = this.configService.get<string>('app.versioning.prefix') ?? 'v'
    this.versioningVersion = this.configService.get<string>('app.versioning.version') ?? '1'
    this.repoVersion = this.configService.get<string>('app.repoVersion') ?? '1.0.0'
  }

  async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
    const originalUrl: string = req.originalUrl
    let version = this.versioningVersion
    if (this.versioningEnable && originalUrl.startsWith(`${this.versioningGlobalPrefix}/${this.versioningPrefix}`)) {
      const url: string[] = originalUrl.split('/')
      version = url[2].replace(this.versioningPrefix, '')
    }

    req.__version = version
    req.__repoVersion = this.repoVersion

    next()
  }
}
