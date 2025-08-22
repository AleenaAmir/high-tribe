import Image from 'next/image'
import TravelCard from '@/components/profile/TravelCard'
import PostFootprints from '@/components/profile/PostFootprints'
import PostNavbar from '@/components/profile/PostNavbar'
import PostCard from '@/components/profile/PostCard'


export default function Home() {
  return (
    <section className='bg-gray-100 p-4'>
      <div className='relative rounded-xl w-full overflow-hidden h-[350px]'>
        <Image
          src='/images/mainPageimg.png'
          alt='Main Page'
          className='object-cover bg-center'
          priority
          fill
        />
      </div>

      <PostNavbar />
      <PostFootprints />
      <TravelCard />
      <PostCard/>
    </section>
  )
}
