import React, { useState } from 'react'
const ViewDayStop = ({ handleViewDayStops, dayStops, formattedDate }: { handleViewDayStops: (formattedDate: string) => void, dayStops: any[], formattedDate: string }) => {

    console.log(dayStops, "dayStops");
    console.log(formattedDate, "formattedDate");

    return (
        <div>
            <button className='text-sm px-4 py-1 font-semibold text-[#9243AC] underline ' onClick={() => handleViewDayStops(formattedDate)}>View Added Stops</button>
        </div>
    )
}

export default ViewDayStop