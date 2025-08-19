import React from "react";

interface UserCardProps {
  name: string;
  subtitle: string;
  avatarUrl: string;
  dateRange?: string;
  countries?: string[];
}

const UserCard = ({
  name,
  subtitle,
  avatarUrl,
  dateRange = "February 2025 - August 2025",
  countries = ["au", "az", "no", "ch", "ke", "fo"],
}: UserCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[#F2F2F1]">
      {/* Cover Image & Profile */}
      <div className="relative h-24">
        <img
          src="/dashboard/profilebg.png"
          alt="cover"
          className="w-full h-full"
        />
        <div className="absolute -bottom-6 left-4">
          <img
            src={avatarUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover ring-4 ring-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-8 px-4 pb-3">
        {/* User Info */}
        <div>
          <h3 className="font-bold text-[18px] text-black font-gilroy">
            Good Morning {name?.split(" ")[0]}
          </h3>
          <p className="text-[12px] font-[500] font-gilroy">{dateRange}</p>
          <p className="text-[11px] mt-1.5 font-gilroy">{subtitle}</p>
        </div>

        {/* Country Flags */}
        <div className="flex items-center gap-1 mt-2">
          {countries.map((country, index) => (
            <img
              key={index}
              src={`https://flagcdn.com/24x18/${country}.png`}
              alt={country}
              className="w-5 h-3.5 rounded-sm"
            />
          ))}
          <span className="text-xs font-medium  ml-1 bg-blue-600 text-white px-2 rounded-full text-center justify-center w-fit h-fit ">
            +21
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
