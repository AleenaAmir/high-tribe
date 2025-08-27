import BadgesEarned from "./leftbarcontent/BadgesEarned";
import ProfileCard from "./leftbarcontent/ProfileCard";
import Statistics from "./leftbarcontent/Statistics";
import TravelActivity from "./leftbarcontent/TravelActivity";
import Recommendations from "./leftbarcontent/Recommendations";
import Chatrooms from "./leftbarcontent/Chatrooms";


export default function LeftSidebar() {
  return (
    <section className="w-70 p-4 fixed top-14 bottom-0 left-0 overflow-y-auto scrollbar-hide text-black">
      <ProfileCard />
      <Statistics />
      <TravelActivity />
      <BadgesEarned />
      <Recommendations />
      <Chatrooms />
    </section>
  );
}

