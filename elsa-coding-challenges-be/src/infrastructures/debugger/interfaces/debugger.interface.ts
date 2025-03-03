import { Response } from 'express'

export interface IDebuggerLog {
    description: string
    class?: string
    function?: string
    path?: string
}

export interface IDebuggerHttpConfig {
    readonly debuggerHttpFormat: string
}

export interface IDebuggerHttpMiddleware extends Response {
    body: string
}
