'use client'
import { useState } from 'react'
import Stats from '@/components/profile/center/centercontent/tabs/stats/Stats'
import Shoutouts from '@/components/profile/center/centercontent/tabs/shoutouts/Shoutouts'
import Reviews from '@/components/profile/center/centercontent/tabs/reviews/Reviews'
import UpcomingBookings from '@/components/profile/center/centercontent/tabs/upcomingbookings/UpcomingBookings'
import Journey from '@/components/profile/center/centercontent/tabs/journey/Journey'
import Media from '@/components/profile/center/centercontent/tabs/media/Media'
import Network from '@/components/profile/center/centercontent/tabs/network/Network'

export default function PostNavbar() {
  const [active, setActive] = useState('Stats')

  const links = [
    'Stats',
    'Shoutout',
    'Reviews',
    'Upcoming Booking',
    'Journey',
    'Media',
    'Network',
  ]

  // Dummy content for each tab
  const tabContent = {
    Stats: <Stats/>,
    Shoutout: <Shoutouts/>,
    Reviews: <Reviews/>,
    'Upcoming Booking': <UpcomingBookings/>,
    Journey: <Journey/>,
    Media: <Media/>,
    Network: <Network/>,
  }

  return (
    <section className=''>
      <div className='mt-4 rounded-xl overflow-hidden'>
        {/* Navbar */}
        <nav className='bg-white p-4'>
          <ul className='flex gap-6'>
            {links.map((link) => (
              <li key={link}>
                <button
                  onClick={() => setActive(link)}
                  className={`pb-1 text-xs font-semibold ${
                    active === link
                      ? 'border-b-2 border-purple-500 text-purple-600'
                      : 'border-b-2 border-transparent hover:border-purple-300'
                  }`}
                >
                  {link}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Content Area */}
      <div className=' mt-4'>
        {tabContent[active]}
      </div>
    </section>
  )
}
