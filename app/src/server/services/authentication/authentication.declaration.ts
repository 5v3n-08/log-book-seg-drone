import { JwtPayload } from 'jsonwebtoken'

export type DecodedRefreshToken = { id: string } & JwtPayload
export type DecodedAccessToken = { id: string; email: string } & JwtPayload
