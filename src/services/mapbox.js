const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function assertToken() {
  if (!MAPBOX_TOKEN) {
    throw new Error('Missing VITE_MAPBOX_TOKEN in .env.local')
  }
}

export async function fetchDirectionsRoute({
  profile = 'mapbox/walking',
  coordinates, // array of [lng, lat] (must be 2+ points)
  signal,
}) {
  assertToken()

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error('coordinates must be an array of at least 2 [lng,lat] points')
  }

  const coordsStr = coordinates.map(([lng, lat]) => `${lng},${lat}`).join(';')

  const url =
    `https://api.mapbox.com/directions/v5/${profile}/${coordsStr}` +
    `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`

  const res = await fetch(url, { signal })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Mapbox Directions error: ${res.status} ${res.statusText} ${text}`)
  }

  const data = await res.json()

  const route = data?.routes?.[0]
  if (!route?.geometry) {
    throw new Error('No route returned from Mapbox')
  }

  return {
    geometry: route.geometry,          // GeoJSON LineString (because geometries=geojson) :contentReference[oaicite:1]{index=1}
    distanceMeters: route.distance,    // meters
    durationSeconds: route.duration,   // seconds
  }
}