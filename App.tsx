import React, { useState, useRef, useMemo } from 'react';
import Map from './components/Map';
import DrawButton from './components/DrawButton';
import MissionModal from './components/MissionModel';
import PolygonModal from './components/PolygonModel';
import { Coordinate } from 'ol/coordinate';
import { LineString, Polygon } from 'ol/geom';
import { calculateDistance } from './utils/distance';

export type WaypointType = {
  coordinates: Coordinate;
  distance: number;
};

const App: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<'LineString' | 'Polygon' | null>(null);
  const [lineStringWaypoints, setLineStringWaypoints] = useState<WaypointType[]>([]);
  const [polygonWaypoints, setPolygonWaypoints] = useState<WaypointType[]>([]);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showPolygonModal, setShowPolygonModal] = useState(false);
  const [insertPolygonIndex, setInsertPolygonIndex] = useState<number | null>(null);

  const mapRef = useRef<any>(null);

  const handleDrawStart = (mode: 'LineString' | 'Polygon') => {
    setDrawingMode(mode);
    if (mode === 'LineString') {
      setShowMissionModal(true);
    } else {
      setShowPolygonModal(true);
    }
  };

  const handleDrawEnd = (geometry: LineString | Polygon) => {
    let coordinates: Coordinate[] = [];
  
    if (geometry instanceof Polygon) {
      coordinates = geometry.getCoordinates()[0]; 
    } else {
      coordinates = geometry.getCoordinates();
    }
  
    const waypoints = coordinates.map((coord: Coordinate, index: number) => ({
      coordinates: coord,
      distance: index > 0 ? calculateDistance(coordinates[index - 1], coord) : 0,
    }));
  
    if (geometry instanceof LineString) {
      setLineStringWaypoints(waypoints);
    } else if (geometry instanceof Polygon) {
      setPolygonWaypoints(waypoints);
    }
  
    setDrawingMode(null);
  };

  const handleInsertPolygon = (index: number, position: 'before' | 'after') => {
    setInsertPolygonIndex(position === 'before' ? index : index + 1);
    setDrawingMode('Polygon');
    setShowMissionModal(false);
    setShowPolygonModal(true);
  };

  const handleImportPolygon = () => {
    if (insertPolygonIndex !== null) {
      const updatedWaypoints = [...lineStringWaypoints];
      updatedWaypoints.splice(insertPolygonIndex, 0, ...polygonWaypoints);
      setLineStringWaypoints(updatedWaypoints);
      setPolygonWaypoints([]);
      setInsertPolygonIndex(null);
      setShowPolygonModal(false);
      setShowMissionModal(true);
    }
  };

  const memoizedMap = useMemo(() => (
    <Map
      ref={mapRef}
      drawingMode={drawingMode}
      onDrawEnd={handleDrawEnd}
    />
  ), [drawingMode]);

  return (
    <div className="h-screen flex flex-col">
      {memoizedMap}
      <div className="absolute top-4 left-4">
        <DrawButton onClick={() => handleDrawStart('LineString')} />
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
  );
};

export default React.memo(App);

