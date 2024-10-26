import type { OpenRouteServiceGeocodeReverseResult } from './open-route.declaration'

const { OPEN_ROUTE_SERVICE_TOKEN } = useRuntimeConfig()

export const geocodeReverse = async (coords: { lat: number; lng: number }) => {
  return await $fetch<OpenRouteServiceGeocodeReverseResult>('https://api.openrouteservice.org/geocode/reverse', {
    params: {
      api_key: OPEN_ROUTE_SERVICE_TOKEN,
      'point.lon': coords.lng,
      'point.lat': coords.lat,
      'boundary.country': 'DE',
    },
  })
}
