export interface OpenRouteServiceGeocodeReverseResult {
  features: Feature[]
}

interface Feature {
  properties: FeatureProperties
}

interface FeatureProperties {
  accuracy: string
  confidence: number
  continent: string
  continent_gid: string
  country: string
  country_a: string
  country_gid: string
  county: string
  county_a: string
  county_gid: string
  distance: number
  gid: string
  housenumber: string
  id: string
  label: string
  layer: string
  localadmin: string
  localadmin_gid: string
  locality: string
  locality_gid: string
  macrocounty: string
  macrocounty_gid: string
  name: string
  postalcode: string
  region: string
  region_a: string
  region_gid: string
  source: string
  source_id: string
  street: string
}
