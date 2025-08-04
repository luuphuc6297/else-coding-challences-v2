import {AppController} from '@app/controllers/app.controller'
import {DynamicModule, ForwardReference, Module, Type} from '@nestjs/common'
import {RouterModule as NestJsRouterModule} from '@nestjs/core'
import {RoutesAuthModule} from '@router/routes/routes.auth.module'
import {RoutesPublicModule} from '@router/routes/routes.public.module'
import {RoutesUserModule} from '@router/routes/routes.user.module'
import {RoutesAdminModule} from './routes/routes.admin.module'
import {RoutesLeaderboardModule} from './routes/routes.leaderboard.module'
import {RoutesQuizAttemptModule} from './routes/routes.quiz-attempt.module'
import {RoutesQuizModule} from './routes/routes.quiz.module'

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = []

    if (process.env.HTTP_ENABLE === 'true') {
      imports.push(
        RoutesPublicModule,
        RoutesUserModule,
        RoutesAdminModule,
        RoutesAuthModule,
        RoutesQuizModule,
        RoutesLeaderboardModule,
        RoutesQuizAttemptModule,
        NestJsRouterModule.register([
          {
            path: '/public',
            module: RoutesPublicModule,
          },
          {
            path: '/admin',
            module: RoutesAdminModule,
          },
          {
            path: '/user',
            module: RoutesUserModule,
          },
          {
            path: '/auth',
            module: RoutesAuthModule,
          },
          {
            path: '/quiz',
            module: RoutesQuizModule,
          },
          {
            path: '/leaderboard',
            module: RoutesLeaderboardModule,
          },
          {
            path: '/quiz-attempts',
            module: RoutesQuizAttemptModule,
          },
        ])
      )
    }

    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [AppController],
      imports,
    }
  }
}
