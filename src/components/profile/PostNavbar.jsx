'use client'
import { useState } from 'react'
import Link from 'next/link'

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

  return (
    <section className='mt-4 rounded-xl overflow-hidden'>
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
    </section>
  )
}
