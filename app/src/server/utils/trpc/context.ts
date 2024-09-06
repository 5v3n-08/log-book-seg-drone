import { User } from '@prisma/client'
import { TRPCError, type inferAsyncReturnType } from '@trpc/server'
import cookie, { CookieSerializeOptions } from 'cookie'
import { NodeEventContext, type H3Event, type NodeIncomingMessage } from 'h3'
import { decodeAccessToken, setAuhtenticationCookies } from '~/server/services/authentication/authentication.helper'
import { AuthenticationService } from '~/server/services/authentication/authentication.service'
import { NoRefreshTokenError, UserBlockedError } from '~/server/services/error/error.helper'
import { tryCatch, tryCatchAsync } from '~/services/utils/utils.helper'

export type Context = inferAsyncReturnType<typeof createContext>
/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/contextcontext
 */
export async function createContext(event: H3Event) {
  const { result: user, error } = await tryCatchAsync(() => handleAuthenticatedUserCheck(event.node))
  console.log(event.node.res.getHeaders())
  if (error) {
    throw error
  }

  return {
    setAuhtenticationCookies: (accessToken: string, refreshToken: string) =>
      setAuhtenticationCookies(event.node, accessToken, refreshToken),
    getCookie: () => getCookie(event.node.req),
    user,
  }
}

const handleAuthenticatedUserCheck = async (node: NodeEventContext): Promise<User | undefined> => {
  let accessToken = node.req.headers.authorization ?? getCookie(node.req)?.accessToken
  const refreshToken = getCookie(node.req)?.refreshToken

  if (!accessToken) {
    if (!refreshToken) {
      return undefined
    }
    const authService = new AuthenticationService()
    const tokens = await authService.refreshAccessToken(refreshToken)
    setAuhtenticationCookies(node, tokens.accessToken, tokens.refreshToken)
    accessToken = tokens.accessToken
  }

  const decodedJwt = decodeAccessToken(accessToken)
  const user = await prisma.user.findFirst({ where: { id: decodedJwt.id }, include: { Tokens: true } })
  if (!user) {
    return undefined
  }

  if (user.blocked_at) {
    throw new UserBlockedError()
  }

  const storedRefreshToken = user.Tokens.find((token) => token.type === 'refresh')
  if (storedRefreshToken && refreshToken !== storedRefreshToken.token) {
    setAuhtenticationCookies(node, accessToken, storedRefreshToken.token)
  }

  return user
}

const getCookie = (req: NodeIncomingMessage): { accessToken?: string; refreshToken?: string } | undefined => {
  // eslint-disable-line
  if (!req.headers.cookie) {
    return
  }
  return cookie.parse(req.headers.cookie)
}

export const setCookieWithNode = (
  node: NodeEventContext,
  key: string,
  value: string,
  options?: CookieSerializeOptions
) => {
  const serializedCookie = cookie.serialize(key, value, options)
  node.res.appendHeader('set-cookie', serializedCookie)
}
