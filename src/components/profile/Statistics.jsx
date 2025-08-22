import Image from 'next/image'
// import Arrow from "@/public/images/Statistic-arrow.png"
import { TfiStatsUp } from 'react-icons/tfi'
import { IoFootsteps } from 'react-icons/io5'
import { FaMapLocationDot } from 'react-icons/fa6'

const StatisticsData = {
  heading: 'Statistics',
  steps: '9542',
  trips: '21558',
  journeys: '328',
}

export default function Statistics() {
  return (
    <section className='border border-gray-200 mt-2 rounded-xl px-2 py-4'>
      <div className='flex gap-2 items-center'>
        {/* <Image className="bg-purple-500 p-1 text-xl" src={Arrow} width={50} height={50} alt="Arrow" /> */}
        <TfiStatsUp className='bg-purple-500 p-1 text-4xl text-white rounded-xl' />
        <h4 className='font-semibold text-sm'>{StatisticsData.heading}</h4>
      </div>
      <div className='flex text-xs items-center justify-center p-2 mt-5'>
        {/* Footsteps */}
        <div className='flex flex-col items-center justify-between text-xs'>
          <IoFootsteps className='text-2xl bg-blue-500 rounded-full p-1' />
          <p className='font-semibold text-xl'>{StatisticsData.steps}</p>
          <h4>Footsteps</h4>
        </div>

        {/* Vertical Divider */}
        <div className='w-px h-10 bg-gray-300 mx-2'></div>

        {/* Trips */}
        <div className='flex flex-col items-center justify-center text-xs'>
          <FaMapLocationDot className='text-2xl bg-green-600 p-1 text-white rounded-full' />
          <p className='font-semibold text-xl '>{StatisticsData.trips}</p>
          <h4>Trips</h4>
        </div>

        {/* Vertical Divider */}
        <div className='w-px h-10 bg-gray-300 mx-2'></div>

        {/* Journeys */}
        <div className='flex flex-col items-center justify-center text-xs'>
          <FaMapLocationDot className='text-2xl bg-green-600 p-1 text-white rounded-full' />
          <p className='font-semibold text-xl'>{StatisticsData.journeys}</p>
          <h4>Journeys</h4>
        </div>
      </div>
    </section>
  )
}
