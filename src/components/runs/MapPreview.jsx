import { useEffect, useMemo, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import Card from '../ui/Card'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import { fetchDirectionsRoute } from '../../services/mapbox'


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

function formatMetersToMiles(meters) {
  const miles = meters / 1609.344
  return `${miles.toFixed(2)} mi`
}

function formatSecondsToMinutes(seconds) {
  const mins = Math.round(seconds / 60)
  return `${mins} min`
}

function MapPreview() {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  // Simple MVP: fixed start/end coordinates (St. Louis-ish).
  
  const coordinates = useMemo(
    () => [
      [-90.2002, 38.6270], // [lng, lat]
      [-90.2150, 38.6355],
    ],
    []
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [routeInfo, setRouteInfo] = useState(null)

  // 1) Create map (once)
  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      setError('Missing VITE_MAPBOX_TOKEN in .env.local')
      return
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates[0],
      zoom: 12,
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [coordinates])

  // 2) Fetch route + draw it
  const loadRoute = async () => {
    setError('')
    setLoading(true)
    setRouteInfo(null)

    const controller = new AbortController()
    try {
      const result = await fetchDirectionsRoute({
        profile: 'mapbox/walking',
        coordinates,
        signal: controller.signal,
      })

      setRouteInfo(result)

      const map = mapRef.current
      if (!map) return

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: result.geometry, // LineString
      }

      const addOrUpdate = () => {
        // source
        if (map.getSource('route')) {
          map.getSource('route').setData(geojson)
        } else {
          map.addSource('route', { type: 'geojson', data: geojson })
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-width': 5 },
          })
        }

        // fit bounds
        const coords = result.geometry.coordinates
        const bounds = coords.reduce(
          (b, [lng, lat]) => b.extend([lng, lat]),
          new mapboxgl.LngLatBounds(coords[0], coords[0])
        )
        map.fitBounds(bounds, { padding: 40 })
      }

      if (map.isStyleLoaded()) addOrUpdate()
      else map.once('load', addOrUpdate)
    } catch (e) {
      setError(e?.message || 'Failed to load route')
    } finally {
      setLoading(false)
    }

    return () => controller.abort()
  }

  // Auto-load once
  useEffect(() => {
    loadRoute()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0 }}>Route Map (Mapbox)</h3>
        <Button onClick={loadRoute}>{loading ? 'Loading...' : 'Reload Route'}</Button>
      </div>

      <Alert message={error} />

      {routeInfo && !error && (
        <p style={{ marginTop: 10 }}>
          Estimated: <strong>{formatMetersToMiles(routeInfo.distanceMeters)}</strong> •{' '}
          <strong>{formatSecondsToMinutes(routeInfo.durationSeconds)}</strong>
        </p>
      )}

      <div
        ref={mapContainerRef}
        style={{
          height: 320,
          marginTop: 12,
          borderRadius: 10,
          overflow: 'hidden',
          background: '#e5e7eb',
        }}
      />
    </Card>
  )
}

export default MapPreview