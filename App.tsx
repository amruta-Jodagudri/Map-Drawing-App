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
  const [drawingMode, setDrawingMode] = useState<'linestring' | 'polygon' | null>(null);
  const [lineStringWaypoints, setLineStringWaypoints] = useState<WaypointType[]>([]);
  const [polygonWaypoints, setPolygonWaypoints] = useState<WaypointType[]>([]);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showPolygonModal, setShowPolygonModal] = useState(false);
  const [insertPolygonIndex, setInsertPolygonIndex] = useState<number | null>(null);

  const mapRef = useRef<any>(null);

  const handleDrawStart = (mode: 'linestring' | 'polygon') => {
    setDrawingMode(mode);
    if (mode === 'linestring') {
      setShowMissionModal(true);
    } else {
      setShowPolygonModal(true);
    }
  };

  const handleDrawEnd = (geometry: LineString | Polygon) => {
    const coordinates = geometry.getCoordinates();
    const waypoints = coordinates.map((coord: Coordinate, index: number) => ({ coordinates: coord, 
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
    setDrawingMode('polygon');
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
        <DrawButton onClick={() => handleDrawStart('linestring')} />
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

