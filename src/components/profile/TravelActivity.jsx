import { BsHandbagFill } from "react-icons/bs"

// ✅ Travel content as separate data
const TravelData = {
  heading: "Travel Activity metrics/stats",
  stats: [
    { value: 1, label: "Travel Advisories Shared" },
    { value: 60, label: "Footprints Posted" },
    { value: 60, label: "Properties, Spaces and Events visited" },
  ],
}

export default function TravelActivity() {
  return (
    <section className="border border-gray-200 mt-2 rounded-xl px-2 py-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <BsHandbagFill className="text-blue-500 text-xl" />
        <h4 className="text-xs font-semibold">{TravelData.heading}</h4>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
        {TravelData.stats.map((stat, index) => (
          <div key={index} className="flex flex-col">
            <h2 className="font-semibold">{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
