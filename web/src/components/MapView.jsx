import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = [6.1319, 1.2223]
const DEFAULT_ZOOM = 13

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

const carIcon = L.divIcon({
  className: '',
  html: '<div style="background:#00A859;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚕</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

const pickupIcon = L.divIcon({
  className: '',
  html: '<div style="background:#00A859;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🟢</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

const dropoffIcon = L.divIcon({
  className: '',
  html: '<div style="background:#FF6B35;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🔴</div>',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
})

export default function MapView({
  center,
  zoom = DEFAULT_ZOOM,
  pickup,
  dropoff,
  drivers = [],
  className = '',
  onClick,
  height = '300px',
}) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (mapInstance.current) return
    const map = L.map(mapRef.current, {
      center: center || DEFAULT_CENTER,
      zoom,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)
    map.on('click', (e) => onClick?.(e.latlng))
    mapInstance.current = map
    return () => { map.remove(); mapInstance.current = null }
  }, [])

  useEffect(() => {
    markersRef.current.forEach((m) => mapInstance.current?.removeLayer(m))
    markersRef.current = []

    if (pickup) {
      const m = L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(mapInstance.current)
      m.bindPopup(`<b>Départ</b><br>${pickup.address || ''}`)
      markersRef.current.push(m)
    }
    if (dropoff) {
      const m = L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon }).addTo(mapInstance.current)
      m.bindPopup(`<b>Arrivée</b><br>${dropoff.address || ''}`)
      markersRef.current.push(m)
    }
    drivers.forEach((d) => {
      const m = L.marker([d.lat, d.lng], { icon: carIcon }).addTo(mapInstance.current)
      m.bindPopup(`<b>${d.name || 'Chauffeur'}</b><br>${d.distance ? d.distance.toFixed(1) + ' km' : ''}`)
      markersRef.current.push(m)
    })
    if (pickup && dropoff) {
      const bounds = L.latLngBounds([pickup.lat, pickup.lng], [dropoff.lat, dropoff.lng])
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] })
    } else if (pickup) {
      mapInstance.current.setView([pickup.lat, pickup.lng], 15)
    }
  }, [pickup, dropoff, drivers])

  return <div ref={mapRef} className={`rounded-xl ${className}`} style={{ height }} />
}
