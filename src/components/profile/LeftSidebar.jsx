import BadgesEarned from "./BadgesEarned";
import ProfileCard from "./ProfileCard";
import Statistics from "./Statistics";
import TravelActivity from "./TravelActivity";
import Recommendations from "./Recommendations";
import Chatrooms from "./Chatrooms";


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

