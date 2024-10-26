import type { User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { DecodedAccessToken, DecodedRefreshToken } from './authentication.declaration'
import { setCookieWithNode } from '~/server/utils/trpc/context'
import type { NodeEventContext } from 'h3'

const SALT_ROUNDS = 10
const ACCESS_TOKEN_SECRET = 'secret'
const ACCESS_TOKEN_EXPIRY = '1h'
const REFRESH_TOKEN_SECRET = 'secret'
const REFRESH_TOKEN_EXPIRY = '10d'

export const generatePasswordHash = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

const generateAccessToken = (user: User) => {
  return jwt.sign({ id: user.id, email: user.email, type: 'ACCESS' }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
}

const generateRefreshToken = (id: string) => {
  return jwt.sign({ id: id, type: 'REFRESH' }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })
}

export const generateAccessAndRefreshToken = async (user: User) => {
  try {
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user.id)
    await prisma.token.upsert({
      create: { token: refreshToken, type: 'refresh', user_id: user.id },
      update: { token: refreshToken },
      where: { user_id_type: { user_id: user.id, type: 'refresh' } },
    })
    return { refreshToken, accessToken }
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to generate access or refesh token!',
      cause: error,
    })
  }
}

export const decodeRefreshToken = (token: string): DecodedRefreshToken => {
  const decodedToken = jwt.verify(token, REFRESH_TOKEN_SECRET)

  if (typeof decodedToken === 'string') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid decoded refresh token!',
    })
  }

  if (!decodedToken.exp || Date.now() >= decodedToken.exp * 1000) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Refresh token is expired!',
    })
  }

  return decodedToken as DecodedRefreshToken
}

export const decodeAccessToken = (token: string): DecodedAccessToken => {
  const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET)

  if (typeof decodedToken === 'string') {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid decoded access token!',
    })
  }

  if (!decodedToken.exp || Date.now() >= decodedToken.exp * 1000) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Access token token is expired!',
    })
  }

  return decodedToken as DecodedAccessToken
}

export const setAuthenticationCookies = (node: NodeEventContext, accessToken: string, refreshToken: string) => {
  setCookieWithNode(node, 'accessToken', accessToken, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 60 * 2,
  })

  setCookieWithNode(node, 'refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}
