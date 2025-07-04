import Image from "next/image";
import React from "react";

export default function NewJourney() {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 max-h-[650px] overflow-y-auto">
      <div></div>
      <div>
        <Image
          src={
            "https://res.cloudinary.com/dtfzklzek/image/upload/v1751668685/Rectangle_4960_ymybyy.png"
          }
          alt="new journey"
          width={510}
          height={642}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
