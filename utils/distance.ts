import { Coordinate } from 'ol/coordinate'
import { getDistance } from 'ol/sphere'

export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  return getDistance(coord1, coord2)
}

