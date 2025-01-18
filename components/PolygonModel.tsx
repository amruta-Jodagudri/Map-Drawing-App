// import React from 'react'
// import { WaypointType } from './MapDrawingApp'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Button } from '@/components/ui/button'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'

// interface PolygonModalProps {
//   waypoints: WaypointType[]
//   onImport: () => void
//   onClose: () => void
// }

// const PolygonModal: React.FC<PolygonModalProps> = ({ waypoints, onImport, onClose }) => {
//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px] bg-gray-700 text-white">
//         <DialogHeader>
//           <DialogTitle>Polygon Waypoints</DialogTitle>
//         </DialogHeader>
//         <div className="max-h-[60vh] overflow-y-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>WP</TableHead>
//                 <TableHead>Coordinates</TableHead>
//                 <TableHead>Distance (m)</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {waypoints.map((waypoint, index) => (
//                 <TableRow key={index}>
//                   <TableCell className="font-medium">WP({index.toString().padStart(2, '0')})</TableCell>
//                   <TableCell>{`${waypoint.coordinates[0].toFixed(6)}, ${waypoint.coordinates[1].toFixed(6)}`}</TableCell>
//                   <TableCell>{waypoint.distance.toFixed(2)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//         <DialogFooter>
//           <Button onClick={onImport} className="mr-2 bg-gray-900 hover:bg-gray-500">Import Points</Button>
//           <Button className='bg-gray-900 hover:bg-gray-500' onClick={onClose} variant="outline">Close</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default PolygonModal




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

interface PolygonModalProps {
  waypoints: WaypointType[]
  onImport: () => void
  onClose: () => void
}

const PolygonModal: React.FC<PolygonModalProps> = ({ waypoints, onImport, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Polygon Waypoints</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>WP</TableHead>
                <TableHead>Coordinates</TableHead>
                <TableHead>Distance (m)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waypoints.map((waypoint, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">WP({index.toString().padStart(2, '0')})</TableCell>
                  <TableCell>
                    {Array.isArray(waypoint.coordinates) && waypoint.coordinates.length >= 2
                      ? `${Number(waypoint.coordinates[0]).toFixed(6)}, ${Number(waypoint.coordinates[1]).toFixed(6)}`
                      : 'Invalid Coordinates'}
                  </TableCell>
                  <TableCell>{waypoint.distance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={onImport} className="mr-2 bg-gray-900 hover:bg-gray-500">Import Points</Button>
          <Button className='bg-gray-900 hover:bg-gray-500' onClick={onClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PolygonModal
