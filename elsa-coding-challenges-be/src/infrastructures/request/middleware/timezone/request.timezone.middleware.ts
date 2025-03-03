import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'

@Injectable()
export class RequestTimezoneMiddleware implements NestMiddleware {
    async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
        req.__timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        next()
    }
}
