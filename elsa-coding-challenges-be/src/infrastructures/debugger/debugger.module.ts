import { DebuggerMiddlewareModule } from '@infras/debugger/middleware/debugger.middleware.module'
import { DebuggerService } from '@infras/debugger/services/debugger.service'
import { DynamicModule, ForwardReference, Global, Module, Provider, Type } from '@nestjs/common'

@Global()
@Module({})
export class DebuggerModule {
    static forRoot(): DynamicModule {
        const providers: Provider<any>[] = []
        const imports: (
            | DynamicModule
            | Type<any>
            | Promise<DynamicModule>
            | ForwardReference<any>
        )[] = []

        if (
            process.env.DEBUGGER_SYSTEM_WRITE_INTO_CONSOLE === 'true' ||
            process.env.DEBUGGER_SYSTEM_WRITE_INTO_FILE === 'true'
        ) {
            providers.push(DebuggerService)
        }

        return {
            module: DebuggerModule,
            providers,
            exports: providers,
            controllers: [],
            imports: [...imports, DebuggerMiddlewareModule],
        }
    }
}
