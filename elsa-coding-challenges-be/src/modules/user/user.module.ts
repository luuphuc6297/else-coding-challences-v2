import { Module } from '@nestjs/common'
import { UserRepositoryModule } from './repository/user.repository.module'
import { UserService } from './services/user.service'

@Module({
    imports: [UserRepositoryModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {} 