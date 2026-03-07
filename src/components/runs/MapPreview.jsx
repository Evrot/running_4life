import { useEffect, useRef, useState } from 'react'
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

function MapPreview({ onDistanceChange }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)

  const [coordinates, setCoordinates] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    if (!import.meta.env.VITE_MAPBOX_TOKEN) {
      setError('Missing VITE_MAPBOX_TOKEN in .env.local')
      return
    }

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-90.2002, 38.627],
      zoom: 12,
    })

    mapRef.current = map

    map.on('load', () => {
      map.addSource('click-points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      })

      map.addLayer({
        id: 'click-points-layer',
        type: 'circle',
        source: 'click-points',
        paint: {
          'circle-radius': 8,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })
    })

    map.on('click', (e) => {
      const clicked = [e.lngLat.lng, e.lngLat.lat]

      setCoordinates((prev) => {
        if (prev.length >= 2) {
          clearRoute()
          updateClickPoints([clicked])
          return [clicked]
        }

        const updated = [...prev, clicked]
        updateClickPoints(updated)
        return updated
      })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (coordinates.length === 2) {
      loadRoute(coordinates)
    } else {
      setRouteInfo(null)
    }
  }, [coordinates])

  function updateClickPoints(coords) {
    const map = mapRef.current
    if (!map) return

    const source = map.getSource('click-points')
    if (!source) return

    const features = coords.map((coord, i) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coord,
      },
      properties: {
        color: i === 0 ? '#16a34a' : '#dc2626',
      },
    }))

    source.setData({
      type: 'FeatureCollection',
      features,
    })
  }

  function clearRoute() {
    const map = mapRef.current
    if (!map) return

    if (map.getLayer('route-line')) map.removeLayer('route-line')
    if (map.getSource('route')) map.removeSource('route')
  }

  async function loadRoute(coords) {
    setLoading(true)
    setError('')
    setRouteInfo(null)

    try {
      const result = await fetchDirectionsRoute({
        profile: 'mapbox/walking',
        coordinates: coords,
      })

      setRouteInfo(result)

      const miles = result.distanceMeters / 1609.344
      onDistanceChange?.(miles.toFixed(2))

      const map = mapRef.current
      if (!map) return

      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: result.geometry,
      }

      const drawRoute = () => {
        if (map.getSource('route')) {
          map.getSource('route').setData(geojson)
        } else {
          map.addSource('route', {
            type: 'geojson',
            data: geojson,
          })

          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-width': 5,
              'line-color': '#2563eb',
            },
          })
        }

        const bounds = result.geometry.coordinates.reduce(
          (b, [lng, lat]) => b.extend([lng, lat]),
          new mapboxgl.LngLatBounds(
            result.geometry.coordinates[0],
            result.geometry.coordinates[0]
          )
        )

        map.fitBounds(bounds, { padding: 40 })
      }

      if (map.isStyleLoaded()) drawRoute()
      else map.once('load', drawRoute)
    } catch (e) {
      setError(e?.message || 'Failed to load route')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setCoordinates([])
    setRouteInfo(null)
    setError('')
    clearRoute()
    updateClickPoints([])
    onDistanceChange?.('')
  }

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h3 style={{ margin: 0 }}>Route Map</h3>
        <Button onClick={handleReset}>Reset Route</Button>
      </div>

      <p style={{ marginTop: 10 }}>
        Click once for <strong>start</strong> and again for <strong>end</strong>.
      </p>

      <Alert message={error} />

      {routeInfo && !error && (
        <p>
          Estimated: <strong>{formatMetersToMiles(routeInfo.distanceMeters)}</strong>{' '}
          • <strong>{formatSecondsToMinutes(routeInfo.durationSeconds)}</strong>
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
          cursor: 'crosshair',
        }}
      />
    </Card>
  )
}

export default MapPreview