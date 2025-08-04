import {InfrasModule} from '@infras/infras.module'
import {Module} from '@nestjs/common'
import {RouterModule} from '@router/router.module'
import {AppController} from './controllers/app.controller'

@Module({
  controllers: [AppController],
  providers: [],
  imports: [InfrasModule, RouterModule.forRoot()],
})
export class AppModule {}
