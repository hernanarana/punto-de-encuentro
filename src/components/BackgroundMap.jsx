import { useEffect } from 'react'
import L from 'leaflet'

export default function BackgroundMap() {
  useEffect(() => {
    const el = document.getElementById('bg-map')
    if (!el) {
      console.error('[BackgroundMap] No se encontró el div #bg-map')
      return
    }

    console.log('[BackgroundMap] Montando mapa…')

    // Crear mapa centrado en CABA (Obelisco)
    const map = L.map(el, {
      center: [-34.6037, -58.3816],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,

      // Lo dejamos como fondo "quieto"
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      touchZoom: false,
      tap: false,
    })

    const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    layer.once('load', () => {
      console.log('[BackgroundMap] Tiles cargados ✔')
    })

    map.on('load', () => {
      console.log('[BackgroundMap] Mapa listo ✔')
    })

    // Limpieza al desmontar
    return () => {
      console.log('[BackgroundMap] Desmontando mapa…')
      map.remove()
    }
  }, [])

  // Importante: altura y ancho para que se renderice siempre
  return (
    <div
      id="bg-map"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100vh', zIndex: -2 }}
    />
  )
}
