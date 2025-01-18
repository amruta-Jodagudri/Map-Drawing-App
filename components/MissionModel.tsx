import React from 'react'
import { WaypointType } from './MapDrawingApp'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

interface MissionModalProps {
  waypoints: WaypointType[]
  onInsertPolygon: (index: number, position: 'before' | 'after') => void
  onClose: () => void
}

const MissionModal: React.FC<MissionModalProps> = ({ waypoints, onInsertPolygon, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent  className="sm:max-w-[600px] bg-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Mission Planner</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>WP</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Distance (m)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waypoints.map((waypoint, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">WP({index.toString().padStart(2, '0')})</TableCell>
                  <TableCell>{`${waypoint.coordinates[0].toFixed(6)}, ${waypoint.coordinates[1].toFixed(6)}`}</TableCell>
                  <TableCell>{waypoint.distance.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onInsertPolygon(index, 'before')}>
                          Insert Polygon Before
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onInsertPolygon(index, 'after')}>
                          Insert Polygon After
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button className='bg-gray-900 hover:bg-gray-500' onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default MissionModal

