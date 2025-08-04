export interface IAuthPassword {
  salt: string
  passwordHash: string
  passwordExpired: Date
  passwordCreated: Date
}

export interface IAuthPayloadOptions {
  loginDate: Date
}

export interface IAuthRefreshTokenOptions {
  notBeforeExpirationTime?: number | string
}
