import React, { useState } from 'react'
import ModalPortal from '../../../profile/leftbar/leftbarcontent/ModalPortal'
import Image from 'next/image'
import ToggleButton from './ToggleButton'

export type Story = { id: number; name: string; img: string; live: boolean }

interface StoryModalProps {
  open: boolean
  onClose: () => void
  story: Story | undefined
}

const StoryModal = ({ open, onClose, story }: StoryModalProps) => {
  if (!open || !story) return null

  const [active, setActive] = useState('active')

  const onChange = (v: string) => {
    setActive(v)
    console.log(v)
  }

  return (
    <ModalPortal open={open} onClose={onClose}>
      <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />
      <div className='relative z-10 bg-white p-6 rounded-md shadow-lg w-[80%] max-w-[900px] mx-auto h-[80%]'>
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-800'
        >
          &times;
        </button>
        <div className='flex h-full'>
          <div className='w-1/4 h-full bg-gray-100 p-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <Image
                  src='/logo.svg'
                  alt='High Tribe'
                  width={130}
                  height={47}
                  className='h-11 w-auto'
                />
              </div>
            </div>
            <h2 className='text-lg font-semibold text-[20px] my-4'>Stories</h2>
            <div className=''>
              <ToggleButton
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Settings', value: 'settings' },
                ]}
                value={'active'}
                onChange={onChange}
              />
            </div>
            <ul className='space-y-2 mt-6'>
              <li className='flex items-center gap-2 cursor-pointer'>
                <Image
                  src={story.img}
                  alt={story.name}
                  width={40}
                  height={40}
                  className='rounded-full'
                />
                <div>
                  <p className='text-sm font-medium'>{story.name}</p>
                  <p className='text-xs text-gray-500'>30 Nov 1m</p>
                </div>
              </li>
              {/* Repeat for other stories */}
            </ul>
          </div>
          <div className='flex-1 flex justify-center items-center bg-[#2d2d3a]'>
            <div className='relative'>
              <Image
                src={story.img}
                alt={`${story.name}'s story`}
                width={500}
                height={500}
                className='rounded-lg'
              />
              <div className='absolute bottom-0 left-0 right-0 p-4 bg-black/50 flex justify-center'>
                <div className='flex space-x-2'>
                  {/* Reaction icons */}

                  <span>😂</span>
                  {/* Add more reactions as needed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default StoryModal
