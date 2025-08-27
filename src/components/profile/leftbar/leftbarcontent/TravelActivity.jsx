import Image from 'next/image'
// ✅ Travel content as separate data
const TravelData = {
  heading: 'Travel Activity metrics/stats',
  stats: [
    { value: 1, label: 'Travel Advisories Shared' },
    { value: 60, label: 'Footprints Posted' },
    { value: 60, label: 'Properties, Spaces and Events visited' },
  ],
}

export default function TravelActivity() {
  return (
    <section className='border border-gray-200 mt-2 rounded-xl  px-2 py-6'>
      {/* Header */}
      <div className='flex items-center gap-2'>
        <Image
          src='/images/travelandActivity.png'
          alt='Statistics'
          width={50}
          height={50}
          className='w-6 h-6'
        />
        <h4 className='text-[13px] font-semibold'>{TravelData.heading}</h4>
      </div>

      {/* Stats grid */}
      <div className='grid grid-cols-2 gap-4 p-2 text-xs mt-4'>
        {TravelData.stats.map((stat, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${
              index === 2 ? 'col-span-2' : ''
            }`}
          >
            <h2 className='font-bold'>{stat.value}</h2>
            <p className='text-center text-[10px]'>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
