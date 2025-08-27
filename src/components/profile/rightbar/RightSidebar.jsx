import Friends from "./rightbarcontent/Friends.jsx";


export default function RightSidebar() {
  return (
    <section className="w-70 bg-white p-4 fixed top-14 scrollbar-hide bottom-0 right-0 overflow-y-auto text-black ">
      <Friends/>
    </section>
  );
}
