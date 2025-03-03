import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import bodyParser from 'body-parser'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class RequestUrlencodedBodyParserMiddleware implements NestMiddleware {
    private readonly maxFile: number

    constructor(private readonly configService: ConfigService) {
        this.maxFile =
            this.configService.get<number>('request.body.urlencoded.maxFileSize') ??
            100 * 1024 * 1024 // 100MB
    }

    use(req: Request, res: Response, next: NextFunction): void {
        bodyParser.urlencoded({
            extended: false,
            limit: this.maxFile,
        })(req, res, next)
    }
}

@Injectable()
export class RequestJsonBodyParserMiddleware implements NestMiddleware {
    private readonly maxFile: number

    constructor(private readonly configService: ConfigService) {
        this.maxFile =
            this.configService.get<number>('request.body.json.maxFileSize') ?? 100 * 1024 * 1024
    }

    use(req: Request, res: Response, next: NextFunction): void {
        bodyParser.json({
            limit: this.maxFile,
        })(req, res, next)
    }
}

@Injectable()
export class RequestRawBodyParserMiddleware implements NestMiddleware {
    private readonly maxFile: number

    constructor(private readonly configService: ConfigService) {
        this.maxFile =
            this.configService.get<number>('request.body.raw.maxFileSize') ?? 100 * 1024 * 1024
    }

    use(req: Request, res: Response, next: NextFunction): void {
        bodyParser.raw({
            limit: this.maxFile,
        })(req, res, next)
    }
}

@Injectable()
export class RequestTextBodyParserMiddleware implements NestMiddleware {
    private readonly maxFile: number

    constructor(private readonly configService: ConfigService) {
        this.maxFile =
            this.configService.get<number>('request.body.text.maxFileSize') ?? 100 * 1024 * 1024
    }

    use(req: Request, res: Response, next: NextFunction): void {
        bodyParser.text({
            limit: this.maxFile,
        })(req, res, next)
    }
}
