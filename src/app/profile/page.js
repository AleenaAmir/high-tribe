import Image from 'next/image'
import PostNavbar from '@/components/profile/center/PostNavbar'


export default function Home() {
  return (
    <section className='bg-gray-100 p-4'>
      <div className='relative rounded-xl w-full overflow-hidden h-[350px]'>
        <Image
          src='/images/mainPageimg.png'
          alt='MainPage'
          className='object-cover bg-center'
          priority
          fill
        />
      </div>

      <PostNavbar />
    </section>
  )
}
