import { decodeRefreshToken, generateAccessAndRefreshToken, verifyPassword } from './authentication.helper'
import { InvalidCredentialsError, NoRefreshTokenError, NoUserFoundError, UserBlockedError } from '../error/error.helper'

export class AuthenticationService {
  public async login(email: string, password: string) {
    const user = await prisma.user.findFirst({ where: { email } })

    // Verify user password
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new InvalidCredentialsError()
    }

    if (user.blocked_at) {
      throw new UserBlockedError()
    }

    const tokes = await generateAccessAndRefreshToken(user)
    return { ...tokes, user }
  }

  public async refreshAccessToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new NoRefreshTokenError()
    }

    const decodedToken = decodeRefreshToken(refreshToken)
    const user = await prisma.user.findFirst({
      where: { id: decodedToken.id },
    })

    if (!user) {
      throw new NoUserFoundError()
    }

    const tokes = await generateAccessAndRefreshToken(user)
    return { ...tokes, user }
  }
}
