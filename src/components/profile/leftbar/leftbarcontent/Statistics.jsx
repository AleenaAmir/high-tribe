import Image from 'next/image'

const StatisticsData = {
  heading: 'Statistics',
  steps: '9542',
  trips: '21558',
  journeys: '328',
}

export default function Statistics() {
  return (
    <section className='border border-gray-200 mt-2 rounded-xl px-2 py-6'>
      <div className='flex gap-2 items-center'>
        <div className='bg-purple-500 px-2 py-3 rounded-md'>
          <Image
          src='/images/StatisticsArrow.png'
          alt='Statistics'
          width={50}
          height={50}
          className='w-4 h-2'
        />
        </div>
        <h4 className='font-semibold text-[13px]'>{StatisticsData.heading}</h4>
      </div>
      <div className='flex text-xs items-center justify-center p-2 mt-5'>
        {/* Footsteps */}
        <div className='flex flex-col items-center justify-between text-xs transition-transform duration-500 hover:scale-110'>
          <Image
            src='/images/footprint.png'
            alt='Footprints'
            width={50}
            height={50}
            className='w-6 h-6 bg-blue-500 rounded-full m-1 p-1 '
          />
          <p className='font-semibold text-xl'>{StatisticsData.steps}</p>
          <h4>Footsteps</h4>
        </div>

        {/* Vertical Divider */}
        <div className='w-px h-10 bg-gray-300 mx-2'></div>

        {/* Trips */}
        <div className='flex flex-col items-center justify-center text-xs transition-transform duration-500 hover:scale-110'>
          <Image
            src='/images/journeyOrtrips.png'
            alt='Trips'
            width={50}
            height={50}
            className='w-6 h-6 bg-green-500 rounded-full m-1 p-1 '
          />
          <p className='font-semibold text-xl '>{StatisticsData.trips}</p>
          <h4>Trips</h4>
        </div>

        {/* Vertical Divider */}
        <div className='w-px h-10 bg-gray-300 mx-2'></div>

        {/* Journeys */}
        <div className='flex flex-col items-center justify-center text-xs transition-transform duration-500 hover:scale-110'>
          <Image
            src='/images/journeyOrtrips.png'
            alt='Journey'
            width={50}
            height={50}
            className='w-6 h-6 bg-green-500 rounded-full m-1 p-1 '
          />
          <p className='font-semibold text-xl'>{StatisticsData.journeys}</p>
          <h4>Journeys</h4>
        </div>
      </div>
    </section>
  )
}
