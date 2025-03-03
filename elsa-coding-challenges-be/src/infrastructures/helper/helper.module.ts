import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { HelperDateService } from './services/helper.date.service'
import { HelperEncryptionService } from './services/helper.encryption.service'
import { HelperHashService } from './services/helper.hash.service'
import { HelperStringService } from './services/helper.string.service'

@Global()
@Module({
    providers: [HelperDateService, HelperEncryptionService, HelperHashService, HelperStringService],
    exports: [HelperDateService, HelperEncryptionService, HelperHashService, HelperStringService],
    controllers: [],
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('helper.jwt.defaultSecretKey'),
                signOptions: {
                    expiresIn: configService.get<string>('helper.jwt.defaultExpirationTime'),
                },
            }),
        }),
    ],
})
export class HelperModule {}
