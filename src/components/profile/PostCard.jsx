'use client'
import { useState } from 'react'
import Image from 'next/image'
import { FaHeart, FaThumbsUp } from 'react-icons/fa'
import { BsEmojiSmile } from 'react-icons/bs'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { FaLocationDot } from 'react-icons/fa6'

const postData = {
  user: {
    name: 'Umer Hussain',
    avatar: '/images/founder.png',
    time: '8 hours ago',
    location: 'Barcelona, Spain',
  },
  description:
    'Lorem ipsum dolor sit amet consectetur. Venenatis in ligula tempus et diam vel viverra et. Nunc habitant maecenas at magna pulvinar velit. Fringilla amet commodo tincidunt quis.',
  images: ['/images/post1.jpg', '/images/post2.jpg', '/images/post3.jpg'],
  reactions: {
    loves: 254,
    likes: 4,
    participants: 9,
    comments: 8,
    shares: 0,
  },
}

export default function PostCard() {
  // Reactions state
  const [reactions, setReactions] = useState({ ...postData.reactions })
  const [userReacted, setUserReacted] = useState({ loved: false, liked: false })

  // Toggle Love
  const handleLove = () => {
    setReactions((prev) => ({
      ...prev,
      loves: prev.loves + (userReacted.loved ? -1 : 1),
    }))
    setUserReacted((prev) => ({ ...prev, loved: !prev.loved }))
  }

  // Toggle Like
  const handleLike = () => {
    setReactions((prev) => ({
      ...prev,
      likes: prev.likes + (userReacted.liked ? -1 : 1),
    }))
    setUserReacted((prev) => ({ ...prev, liked: !prev.liked }))
  }

  // Comments state
  const [comments, setComments] = useState([])
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      setComments([...comments, inputValue])
      setInputValue('')
    }
  }

  return (
    <section className='bg-white rounded-xl shadow-md p-4 mt-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Image
            src={postData.user.avatar}
            alt={postData.user.name}
            width={40}
            height={40}
            className='rounded-full'
          />
          <div>
            <h2 className='font-semibold text-sm'>{postData.user.name}</h2>
            <p className='text-xs text-gray-500 flex'>
              {postData.user.time} ·{' '}
              <span className='ml-1 flex'>
                {' '}
                <FaLocationDot className='text-red-500 ml-1' />
                {postData.user.location}
              </span>
            </p>
          </div>
        </div>
        <HiOutlineDotsHorizontal className='text-gray-600 text-lg cursor-pointer' />
      </div>

      {/* Description */}
      <p className='text-xs text-gray-500 mt-3'>{postData.description}</p>

      {/* Post Images Grid */}
      <div
        className={`grid gap-2 mt-3 ${
          postData.images.length === 1
            ? 'grid-cols-1'
            : postData.images.length === 2
            ? 'grid-cols-2'
            : 'grid-cols-2'
        }`}
      >
        {postData.images.map((img, idx) => (
          <div key={idx} className='relative w-full h-64'>
            <Image
              src={img}
              alt={`Post ${idx + 1}`}
              fill
              className='object-cover rounded-md'
            />
          </div>
        ))}
      </div>

      {/* Reactions */}
      <div className='flex justify-between items-center mt-3 text-sm text-gray-600'>
        <div className='flex items-center gap-3'>
          <button onClick={handleLove} className='flex items-center gap-1'>
            <FaHeart
              className={userReacted.loved ? 'text-red-500' : 'text-gray-400'}
            />
            <span>{reactions.loves}</span>
          </button>

          <span>·</span>

          <button onClick={handleLike} className='flex items-center gap-1'>
            <FaThumbsUp
              className={userReacted.liked ? 'text-blue-500' : 'text-gray-400'}
            />
            <span>{reactions.likes} Likes</span>
          </button>
        </div>

        <div className='flex items-center gap-4'>
          <span>{reactions.participants} Participants</span>
          <span>{reactions.comments + comments.length} Comments</span>
          <span>{reactions.shares} Share</span>
        </div>
      </div>

      {/* Comments List */}
      {comments.length > 0 && (
        <div className='mt-3 space-y-2'>
          {comments.map((comment, idx) => (
            <div key={idx} className='flex items-start gap-2'>
              <Image
                src={postData.user.avatar}
                alt='User'
                width={30}
                height={30}
                className='rounded-full'
              />
              <div className='bg-gray-100 p-2 rounded-lg text-sm'>
                <span className='font-semibold'>{postData.user.name} </span>
                {comment}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Bar */}
      <div className='flex items-center border-t mt-3 pt-3'>
        <BsEmojiSmile className='text-gray-500 text-xl mr-2' />
        <input
          type='text'
          placeholder='Add a comment...'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className='flex-1 border-none outline-none text-xs bg-transparent'
        />
      </div>
    </section>
  )
}
