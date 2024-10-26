import type { OpenRouteServiceGeocodeReverseResult } from './open-route.declaration'

export const geocodeReverse = async (coords: { lat: number; lng: number }) => {
  return await $fetch<OpenRouteServiceGeocodeReverseResult>('https://api.openrouteservice.org/geocode/reverse', {
    params: {
      api_key: process.env.OPEN_ROUTE_SERVICE_TOKEN,
      'point.lon': coords.lng,
      'point.lat': coords.lat,
      'boundary.country': 'DE',
    },
  })
}
