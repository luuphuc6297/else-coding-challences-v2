import {registerAs} from '@nestjs/config'
import {seconds} from '@infras/helper/constants/helper.function.constant'

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    salt: {
      length: 8,
    },
    jwt: {
      secretKey: process.env.HELPER_JWT_SECRET_KEY || 'development-only-secret-change-in-production',
      expirationTime: seconds('1h'),
      notBeforeExpirationTime: seconds('0'),
    },
  })
)
