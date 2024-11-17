import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'
import { AuthenticationService } from '~/server/services/authentication/authentication.service'
import { generatePasswordHash } from '~/server/services/authentication/authentication.helper'

const $auth = new AuthenticationService()

export const userRouter = router({
  current: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findFirst({ where: { id: ctx.user.id } })
  }),
  logout: protectedProcedure.query(({ ctx }) => {
    ctx.setAuthenticationCookies('', '')
    return { success: true }
  }),
  statistic: protectedProcedure.query(async ({ ctx }) => {
    let timeFlight = 0
    let timeNightFlight = 0

    const logs = await prisma.logBook.findMany({ where: { user_id: ctx.user.id } })
    for (const log of logs) {
      let time = 0
      for (const { start, end } of log.flights) {
        time += new Date(end).getTime() - new Date(start).getTime()
      }
      timeFlight += time
      if (log.is_night_flight) {
        timeNightFlight += time
      }
    }

    const timeFligtMax = 1000 * 60 * 60 * 5 // 5 Stunden
    const timeNightFligtMax = 1000 * 60 * 60 * 2 // 2 Stunden

    return {
      success: true,
      flightTime: { value: msToTime(timeFlight), percent: ((timeFlight * 100) / timeFligtMax).toFixed(0) },
      nightFlightTime: {
        value: msToTime(timeNightFlight),
        percent: ((timeNightFlight * 100) / timeNightFligtMax).toFixed(0),
      },
    }
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
    .mutation(async ({ input, ctx }) => {
      if (await prisma.user.findFirst({ where: { email: input.email } })) {
        throw new Error('User already exists!')
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: await generatePasswordHash(input.password.toString()),
        },
      })

      const { accessToken, refreshToken } = await $auth.login(input.email, input.password)
      ctx.setAuthenticationCookies(accessToken, refreshToken)

      return { success: true, user }
    }),
})

const msToTime = (duration: number) => {
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  const hoursStr = hours < 10 ? '0' + hours : hours
  const minutesStr = minutes < 10 ? '0' + minutes : minutes

  return hoursStr + ':' + minutesStr
}
