import { TRPCError } from '@trpc/server'

export class NoUserFoundError extends TRPCError {
  constructor() {
    super({ code: 'UNAUTHORIZED', message: '#4.10 - No user found!' })
  }
}

export class NoUserFoundContextError extends TRPCError {
  constructor() {
    super({ code: 'FORBIDDEN', message: '#4.11 - No user found!' })
  }
}

export class UserBlockedError extends TRPCError {
  constructor() {
    super({ code: 'UNAUTHORIZED', message: '#4.2 - User is blocked!' })
  }
}

export class NoRefreshTokenError extends TRPCError {
  constructor() {
    super({ code: 'UNAUTHORIZED', message: '#4.3 - No refresh token found on request!' })
  }
}

export class InvalidCredentialsError extends TRPCError {
  constructor() {
    super({ code: 'UNAUTHORIZED', message: '#4.4 - Invalid credentials!' })
  }
}
