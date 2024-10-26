import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'
import { geocodeReverse } from '~/server/services/open-route/open-route.service'

export const logBookRouter = router({
  all: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.logBook.findMany({ where: { user_id: ctx.user.id }, orderBy: { start: 'desc' } })
  }),
  location: protectedProcedure
    .input(
      z.object({
        lat: z.number(),
        lng: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await geocodeReverse(input)
      const firstMatch = result.features.length > 0 ? result.features[0] : undefined
      if (!firstMatch) {
        throw new Error('Keine Adresse gefunden!')
      }
      return { success: true, address: `${firstMatch.properties.name}, ${firstMatch.properties.localadmin}`, ...input }
    }),
  create: protectedProcedure
    .input(
      z.object({
        start: z.date(),
        end: z.date(),
        location: z.string().optional(),
        type: z.union([z.literal('training'), z.literal('operation')]),
        isFlightModeAutomatic: z.boolean().optional(),
        isFlightModeManuel: z.boolean().optional(),
        isNightFlight: z.boolean().optional(),
        notes: z.string().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        operationId: z.string().optional(),
        operationName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const dummy = await prisma.device.findFirst({ where: { id: '0' } })
      if (!dummy) {
        await prisma.device.create({ data: { id: '0', name: 'DJI' } })
      }
      await prisma.logBook.create({
        data: {
          start: input.start,
          end: input.end,
          location: input.location,
          type: input.type,
          is_flight_mode_automatic: input.isFlightModeAutomatic,
          is_flight_mode_manuel: input.isFlightModeManuel,
          is_night_flight: input.isNightFlight,
          notes: input.notes,
          lat: input.lat,
          lng: input.lng,
          operation_id: input.operationId,
          operation_name: input.operationName,
          user_id: ctx.user.id,
          device_id: '0',
        },
      })
      return { success: true }
    }),
})
