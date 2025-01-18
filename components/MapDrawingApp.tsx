// 'use client'

// import React, { useState, useRef, useMemo } from 'react'
// import dynamic from 'next/dynamic'
// import { Button } from '@/components/ui/button'
// import { Coordinate } from 'ol/coordinate'
// import { LineString, Polygon } from 'ol/geom'
// import { calculateDistance } from '@/utils/distance'
// import MissionModal from './MissionModel'
// import PolygonModal from './PolygonModel'

// const Loader = () => (
//   <div className="flex justify-center items-center h-screen">
//     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
//   </div>
// );

// const Map = dynamic(() => import('@/components/Map'), {
//   ssr: false,
//   loading: () => <Loader />,
// })

// export type WaypointType = {
//   coordinates: Coordinate
//   distance: number
// }

// const MapDrawingApp: React.FC = () => {
//   const [drawingMode, setDrawingMode] = useState<'LineString' | 'Polygon' | null>(null)
//   const [lineStringWaypoints, setLineStringWaypoints] = useState<WaypointType[]>([])
//   const [polygonWaypoints, setPolygonWaypoints] = useState<WaypointType[]>([])
//   const [showMissionModal, setShowMissionModal] = useState(false)
//   const [showPolygonModal, setShowPolygonModal] = useState(false)
//   const [insertPolygonIndex, setInsertPolygonIndex] = useState<number | null>(null)

//   const mapRef = useRef<any>(null)
  

//   const handleDrawStart = (mode: 'LineString' | 'Polygon') => {
//     setDrawingMode(mode)
//     if (mode === 'LineString') {
//       setShowMissionModal(true)
//     } else {
//       setShowPolygonModal(true)
//     }
//   }

//   const handleDrawEnd = (geometry: LineString | Polygon) => {
//     let coordinates: Coordinate[];
  
//     if (geometry instanceof LineString) {
//       coordinates = geometry.getCoordinates(); // LineString returns a flat array of coordinates
//     } else if (geometry instanceof Polygon) {
//       coordinates = geometry.getCoordinates()[0]; // Polygon returns a nested array, extract the first ring
//     } else {
//       return;
//     }
  
//     const waypoints = coordinates.map((coord: Coordinate, index: number) => ({
//       coordinates: coord,
//       distance: index > 0 ? calculateDistance(coordinates[index - 1], coord) : 0,
//     }));
  
//     if (geometry instanceof LineString) {
//       setLineStringWaypoints(waypoints);
//       setShowMissionModal(true);
//     } else if (geometry instanceof Polygon) {
//       setPolygonWaypoints(waypoints);
//       setShowPolygonModal(true);
//     }
  
//     setDrawingMode(null);
//   };

//   const handleInsertPolygon = (index: number, position: 'before' | 'after') => {
//     setInsertPolygonIndex(position === 'before' ? index : index + 1)
//     setDrawingMode('Polygon')
//     setShowMissionModal(false)
//     setShowPolygonModal(true)
//   }

//   const handleImportPolygon = () => {
//     if (insertPolygonIndex !== null) {
//       const updatedWaypoints = [...lineStringWaypoints]
//       updatedWaypoints.splice(insertPolygonIndex, 0, ...polygonWaypoints)
//       setLineStringWaypoints(updatedWaypoints)
//       setPolygonWaypoints([])
//       setInsertPolygonIndex(null)
//       setShowPolygonModal(false)
//       setShowMissionModal(true)
//     }
//   }

//   const memoizedMap = useMemo(() => (
//     <Map
//       ref={mapRef}
//       drawingMode={drawingMode}
//       onDrawEnd={handleDrawEnd}
//     />
//   ), [drawingMode])

//   return (
//     <div className="relative h-screen w-full">
//       {memoizedMap}
//       <div className="absolute top-4 left-4 z-10">
//         <Button className='bg-neutral-700 text-white hover:bg-gray-500' onClick={() => handleDrawStart('LineString')}>
//           Draw LineString
//         </Button>
//         <Button onClick={() => handleDrawStart('Polygon')} className="ml-2 bg-neutral-700 text-white hover:bg-gray-500">
//           Draw Polygon
//         </Button>
//       </div>
//       {showMissionModal && (
//         <MissionModal
//           waypoints={lineStringWaypoints}
//           onInsertPolygon={handleInsertPolygon}
//           onClose={() => setShowMissionModal(false)}
//         />
//       )}
//       {showPolygonModal && (
//         <PolygonModal
//           waypoints={polygonWaypoints}
//           onImport={handleImportPolygon}
//           onClose={() => setShowPolygonModal(false)}
//         />
//       )}
//     </div>
//   )
// }

// export default MapDrawingApp


'use client'

import React, { useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Coordinate } from 'ol/coordinate'
import { LineString, Polygon } from 'ol/geom'
import { calculateDistance } from '@/utils/distance'
import MissionModal from './MissionModel'
import PolygonModal from './PolygonModel'
import { MapRef } from '@/components/Map' // Import the MapRef type

const Loader = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
  </div>
)

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <Loader />,
})

export type WaypointType = {
  coordinates: Coordinate
  distance: number
}

const MapDrawingApp: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<'LineString' | 'Polygon' | null>(null)
  const [lineStringWaypoints, setLineStringWaypoints] = useState<WaypointType[]>([])
  const [polygonWaypoints, setPolygonWaypoints] = useState<WaypointType[]>([])
  const [showMissionModal, setShowMissionModal] = useState(false)
  const [showPolygonModal, setShowPolygonModal] = useState(false)
  const [insertPolygonIndex, setInsertPolygonIndex] = useState<number | null>(null)

  const mapRef = useRef<MapRef | null>(null) // Updated ref type

  const handleDrawStart = (mode: 'LineString' | 'Polygon') => {
    setDrawingMode(mode)
    if (mode === 'LineString') {
      setShowMissionModal(true)
    } else {
      setShowPolygonModal(true)
    }
  }

  const handleDrawEnd = (geometry: LineString | Polygon) => {
    let coordinates: Coordinate[]

    if (geometry instanceof LineString) {
      coordinates = geometry.getCoordinates() // LineString returns a flat array of coordinates
    } else if (geometry instanceof Polygon) {
      coordinates = geometry.getCoordinates()[0] // Polygon returns a nested array, extract the first ring
    } else {
      return
    }

    const waypoints = coordinates.map((coord: Coordinate, index: number) => ({
      coordinates: coord,
      distance: index > 0 ? calculateDistance(coordinates[index - 1], coord) : 0,
    }))

    if (geometry instanceof LineString) {
      setLineStringWaypoints(waypoints)
      setShowMissionModal(true)
    } else if (geometry instanceof Polygon) {
      setPolygonWaypoints(waypoints)
      setShowPolygonModal(true)
    }

    setDrawingMode(null)
  }

  const handleInsertPolygon = (index: number, position: 'before' | 'after') => {
    setInsertPolygonIndex(position === 'before' ? index : index + 1)
    setDrawingMode('Polygon')
    setShowMissionModal(false)
    setShowPolygonModal(true)
  }

  const handleImportPolygon = () => {
    if (insertPolygonIndex !== null) {
      const updatedWaypoints = [...lineStringWaypoints]
      updatedWaypoints.splice(insertPolygonIndex, 0, ...polygonWaypoints)
      setLineStringWaypoints(updatedWaypoints)
      setPolygonWaypoints([])
      setInsertPolygonIndex(null)
      setShowPolygonModal(false)
      setShowMissionModal(true)
    }
  }

  const memoizedMap = useMemo(
    () => (
      <Map
        ref={mapRef}
        drawingMode={drawingMode}
        onDrawEnd={handleDrawEnd}
      />
    ),
    [drawingMode]
  )

  return (
    <div className="relative h-screen w-full">
      {memoizedMap}
      <div className="absolute top-4 left-4 z-10">
        <Button
          className="bg-neutral-700 text-white hover:bg-gray-500"
          onClick={() => handleDrawStart('LineString')}
        >
          Draw LineString
        </Button>
        <Button
          onClick={() => handleDrawStart('Polygon')}
          className="ml-2 bg-neutral-700 text-white hover:bg-gray-500"
        >
          Draw Polygon
        </Button>
      </div>
      {showMissionModal && (
        <MissionModal
          waypoints={lineStringWaypoints}
          onInsertPolygon={handleInsertPolygon}
          onClose={() => setShowMissionModal(false)}
        />
      )}
      {showPolygonModal && (
        <PolygonModal
          waypoints={polygonWaypoints}
          onImport={handleImportPolygon}
          onClose={() => setShowPolygonModal(false)}
        />
      )}
    </div>
  )
}

export default MapDrawingApp

