import { HelperDateService } from '@infras/helper/services/helper.date.service'
import { IRequestApp } from '@infras/request/interfaces/request.interface'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'

@Injectable()
export class RequestTimestampMiddleware implements NestMiddleware {
    constructor(private readonly helperDateService: HelperDateService) {}

    async use(req: IRequestApp, res: Response, next: NextFunction): Promise<void> {
        req.__xTimestamp = req['x-timestamp'] ? Number(req['x-timestamp']) : undefined
        req.__timestamp = this.helperDateService.timestamp()
        next()
    }
}
