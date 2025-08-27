import PostCard from '@/components/profile/center/centercontent/tabs/stats/PostCard'
import TravelCard from '@/components/profile/center/centercontent/tabs/stats/TravelCard'
import PostFootprints from './PostFootprints'

export default function Stats() {
  return (
    <section>
        <PostFootprints/>
        <TravelCard/>
        <PostCard/>
    </section>
  )
}
