import { DEBUGGER_HTTP_FORMAT } from '@infras/debugger/constants/debugger.constant'
import {
    IDebuggerHttpConfig,
    IDebuggerHttpMiddleware,
} from '@infras/debugger/interfaces/debugger.interface'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NextFunction, Request, Response } from 'express'
import morgan from 'morgan'

@Injectable()
export class DebuggerHttpMiddleware implements NestMiddleware {
    private readonly writeIntoFile: boolean
    private readonly writeIntoConsole: boolean

    constructor(private readonly configService: ConfigService) {
        const writeIntoFile: boolean | undefined = this.configService.get<boolean>(
            'debugger.http.writeIntoFile'
        )
        const writeIntoConsole: boolean | undefined = this.configService.get<boolean>(
            'debugger.http.writeIntoConsole'
        )
        this.writeIntoFile = writeIntoFile ?? false
        this.writeIntoConsole = writeIntoConsole ?? false
    }

    private customToken(): void {
        morgan.token('req-params', (req: Request) => JSON.stringify(req.params))

        morgan.token('req-body', (req: Request) => JSON.stringify(req.body))

        morgan.token('res-body', (req: Request, res: IDebuggerHttpMiddleware) => res.body)

        morgan.token('req-headers', (req: Request) => JSON.stringify(req.headers))
    }

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (this.writeIntoConsole || this.writeIntoFile) {
            this.customToken()
        }

        next()
    }
}

@Injectable()
export class DebuggerHttpWriteIntoConsoleMiddleware implements NestMiddleware {
    private readonly writeIntoConsole: boolean

    constructor(private readonly configService: ConfigService) {
        const writeIntoConsole: boolean | undefined = this.configService.get<boolean>(
            'debugger.http.writeIntoConsole'
        )
        this.writeIntoConsole = writeIntoConsole ?? false
    }

    private async httpLogger(): Promise<IDebuggerHttpConfig> {
        return {
            debuggerHttpFormat: DEBUGGER_HTTP_FORMAT,
        }
    }

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (this.writeIntoConsole) {
            const config: IDebuggerHttpConfig = await this.httpLogger()

            morgan(config.debuggerHttpFormat)(req, res, next)
        } else {
            next()
        }
    }
}

@Injectable()
export class DebuggerHttpResponseMiddleware implements NestMiddleware {
    private readonly writeIntoFile: boolean
    private readonly writeIntoConsole: boolean

    constructor(private readonly configService: ConfigService) {
        const writeIntoConsole: boolean | undefined = this.configService.get<boolean>(
            'debugger.http.writeIntoConsole'
        )
        const writeIntoFile: boolean | undefined = this.configService.get<boolean>(
            'debugger.http.writeIntoFile'
        )
        this.writeIntoConsole = writeIntoConsole ?? false
        this.writeIntoFile = writeIntoFile ?? false
    }
    use(req: Request, res: Response, next: NextFunction): void {
        if (this.writeIntoConsole || this.writeIntoFile) {
            const send: any = res.send
            const resOld: any = res

            // Add response data to request
            // this is for morgan
            resOld.send = (body: any) => {
                resOld.body = body
                resOld.send = send
                resOld.send(body)

                res = resOld as Response
            }
        }

        next()
    }
}
