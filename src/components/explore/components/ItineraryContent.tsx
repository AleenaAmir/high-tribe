import React from 'react'
import DayItem from './DayItem'
import { Step } from '@/components/dashboard/modals/components/newjourney/types'

interface ItineraryContentProps {
  finalDisplayDays: any[]
  openDayIndex: number | null
  journeyData: any
  dayStops: any[] // fallback global stops (optional)
  onAddStop: (
    dayIndex: number,
    formattedDate: string,
    dayNumber: number
  ) => void
  handleViewDayStops: (formattedDate: string) => void

  // NEW: parent should supply a delete handler for days
  onDeleteDay: (dayIndex: number) => void
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  finalDisplayDays,
  openDayIndex,
  handleViewDayStops,
  dayStops,
  onAddStop,
  onDeleteDay,
}) => {
  return (
    <div className='flex-1 overflow-y-auto min-h-0'>
      <div className='p-3 space-y-2'>
        {finalDisplayDays.map((day: any, dayIndex: number) => {
          const isOpen = openDayIndex === dayIndex
          const isLastDay = dayIndex === finalDisplayDays.length - 1

          return (
            <DayItem
              key={day.id ?? dayIndex}
              day={day}
              dayIndex={dayIndex}
              // prefer day.stops if available, otherwise fall back to the supplied dayStops
              dayStops={day.stops ?? dayStops}
              onAddStop={onAddStop}
              handleViewDayStops={(formattedDate: string) =>
                handleViewDayStops(formattedDate)
              }
              onDeleteDay={onDeleteDay}   // <-- required
              isLastDay={isLastDay}       // <-- required
            />
          )
        })}
      </div>
    </div>
  )
}

export default ItineraryContent
