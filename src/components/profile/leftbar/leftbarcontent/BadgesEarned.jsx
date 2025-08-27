import Image from "next/image"

const BadgeData = {
  travelBadge: '9542',
  hostBadge: '2938',
}

export default function BadgesEarned() {
  return (
    <section className='border border-gray-200 mt-2 rounded-xl px-2 py-6'>
      <div className='flex items-center gap-1'>
        <Image
          src='/images/badge.png'
          alt='Statistics'
          width={50}
          height={50}
          className='w-10 h-10'
        />
        <h4 className='font-semibold text-[13px]'>Badges Earned</h4>
      </div>
      <div className='flex text-xs items-center justify-center p-2 mt-5'>
        {/* Footsteps */}
        <div className='flex flex-col items-center justify-between text-xs transition-transform duration-500 hover:scale-110'>
          <p className='font-semibold text-xl'>{BadgeData.travelBadge}</p>
          <h4>Travel Badges</h4>
        </div>

        {/* Vertical Divider */}
        <div className='w-px h-10 bg-gray-300 mx-2'></div>

        {/* Trips */}
        <div className='flex flex-col items-center justify-center text-xs transition-transform duration-500 hover:scale-110'>
          <p className='font-semibold text-xl '>{BadgeData.hostBadge}</p>
          <h4>Host Badges</h4>
        </div>
      </div>
    </section>
  )
}
