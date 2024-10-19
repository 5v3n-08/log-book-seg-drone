import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { AuthenticationService } from '~/server/services/authentication/authentication.service'
import { generatePasswordHash } from '~/server/services/authentication/authentication.helper'

const $auth = new AuthenticationService()

export const userRouter = router({
  current: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findFirst({ where: { id: ctx.user.id } })
  }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accessToken, refreshToken, user } = await $auth.login(input.email, input.password)
      ctx.setAuthenticationCookies(accessToken, refreshToken)
      return { success: true, user }
    }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().length(4),
      })
    )
    .mutation(async ({ input }) => {
      if (await prisma.user.findFirst({ where: { email: input.email } })) {
        throw new Error('User already exists!')
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: await generatePasswordHash(input.password.toString()),
        },
      })

      return user
    }),
})
