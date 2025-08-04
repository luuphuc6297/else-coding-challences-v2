import {seconds} from '@infras/helper/constants/helper.function.constant'
import {registerAs} from '@nestjs/config'

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    accessToken: {
      secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY ?? '123456',
      expirationTime: seconds('1h'), // 1 hours
      notBeforeExpirationTime: seconds('0'), // immediately

      encryptKey: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV,
    },

    refreshToken: {
      secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ?? '123456000',
      expirationTime: seconds('14d'), // 14 days
      notBeforeExpirationTime: seconds('1h'), // 1 hours

      encryptKey: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV,
    },

    subject: process.env.AUTH_JWT_SUBJECT ?? 'elsaCodingChallengesDevelopment',
    audience: process.env.AUTH_JWT_AUDIENCE ?? 'https://example.com',
    issuer: process.env.AUTH_JWT_ISSUER ?? 'elsa-coding-challenges',
    prefixAuthorization: 'Bearer',
    payloadEncryption: process.env.AUTH_JWT_PAYLOAD_ENCRYPT === 'true' ? true : false,

    password: {
      attempt: true,
      maxAttempt: 5,
      saltLength: 6,
      expiredIn: seconds('182d'), // 182 days
    },
  })
)
