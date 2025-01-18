'use client'

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { Draw, Modify } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { LineString, Polygon } from 'ol/geom'
import { fromLonLat } from 'ol/proj'

interface MapProps {
  drawingMode: 'LineString' | 'Polygon' | null
  onDrawEnd: (geometry: LineString | Polygon) => void
}

const MapComponent = forwardRef<any, MapProps>(({ drawingMode, onDrawEnd }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<Map | null>(null)
  const drawInteractionRef = useRef<Draw | null>(null)
  const vectorSourceRef = useRef<VectorSource | null>(null)

  useImperativeHandle(ref, () => ({
    getMap: () => mapInstanceRef.current,
  }))

  useEffect(() => {
    if (!mapRef.current) return

    vectorSourceRef.current = new VectorSource()
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
    })

    mapInstanceRef.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
        projection: 'EPSG:4326',
      }),
    })

    const modify = new Modify({ source: vectorSourceRef.current })
    mapInstanceRef.current.addInteraction(modify)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined)
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return

    if (drawInteractionRef.current) {
      mapInstanceRef.current.removeInteraction(drawInteractionRef.current)
    }

    if (drawingMode) {
      drawInteractionRef.current = new Draw({
        source: vectorSourceRef.current,
        type: drawingMode,
      })

      drawInteractionRef.current.on('drawend', (event: any) => {
        onDrawEnd(event.feature.getGeometry() as LineString | Polygon)
      })

      mapInstanceRef.current.addInteraction(drawInteractionRef.current)
    }

    return () => {
      if (drawInteractionRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeInteraction(drawInteractionRef.current)
      }
    }
  }, [drawingMode, onDrawEnd])

  return <div ref={mapRef} className="w-full h-full" />
})

MapComponent.displayName = 'MapComponent'

export default MapComponent

