// types.ts

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PrismaJson {
    type PrismaLogBookFlights = { start: string; end: string }[]
  }
}
