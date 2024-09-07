import { router } from '../trpc'
import { userRouter } from './user'

export const appRouter = router({
  // todo: todoRouter,
  user: userRouter
})

export type AppRouter = typeof appRouter