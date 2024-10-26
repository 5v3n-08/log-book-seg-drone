import { router } from '../trpc'
import { logBookRouter } from './log-book'
import { userRouter } from './user'

export const appRouter = router({
  // todo: todoRouter,
  user: userRouter,
  logBook: logBookRouter,
})

export type AppRouter = typeof appRouter
