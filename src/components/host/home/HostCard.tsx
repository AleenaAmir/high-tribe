import Image from "next/image";
import Link from "next/link";
import React from "react";

export const HostCard = ({
  head,
  text,
  link,
  img,
  status,
}: {
  head: string;
  text: string;
  link: string;
  img: string;
  status: boolean;
}) => {
  const done = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 26 26"
      className="absolute top-2.5 right-4 z-10 hover:animate-bounce"
    >
      <circle cx="13" cy="13" r="13" fill="#0AC869"></circle>
      <circle
        cx="13"
        cy="13"
        r="12"
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="2"
      ></circle>
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8 14 3 3 7-7"
      ></path>
    </svg>
  );

  const pending = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      fill="none"
      viewBox="0 0 26 26"
      className="absolute top-2.5 right-4 z-10 hover:animate-bounce"
    >
      <circle cx="13" cy="13" r="13" fill="#F4D35D"></circle>
      <circle
        cx="13"
        cy="13"
        r="12"
        stroke="#fff"
        strokeOpacity="0.8"
        strokeWidth="2"
      ></circle>
      <g fill="#fff" clipPath="url(#clip0_1276_8094)">
        <path d="M18.59 12.81a1.28 1.28 0 0 0-.94-.399c-.362 0-.668.13-.93.392a1.28 1.28 0 0 0-.392.939q-.002.541.384.931.393.394.939.392.544 0 .939-.392c.263-.264.39-.569.39-.931s-.127-.67-.39-.932M16.05 16.288c-.34 0-.625.113-.86.349a1.14 1.14 0 0 0-.348.845c0 .335.112.62.348.861.233.235.52.348.86.348.335 0 .612-.114.847-.348.242-.242.363-.526.363-.861s-.123-.61-.363-.845a1.15 1.15 0 0 0-.846-.35M16.23 11.53q.588 0 1.017-.426a1.4 1.4 0 0 0 .427-1.024q0-.606-.427-1.032a1.39 1.39 0 0 0-1.017-.419q-.608 0-1.024.42a1.4 1.4 0 0 0-.427 1.03q0 .597.427 1.025a1.4 1.4 0 0 0 1.024.426M12.298 17.83q-.45-.001-.768.32-.313.317-.313.776c0 .299.105.557.313.76q.318.315.768.314c.305 0 .56-.11.768-.314q.318-.312.32-.76a1.07 1.07 0 0 0-.32-.783 1.05 1.05 0 0 0-.768-.312M12.297 7q-.651-.001-1.11.455a1.5 1.5 0 0 0-.455 1.103c0 .434.15.81.456 1.117q.458.456 1.109.455.65.001 1.11-.455c.305-.307.461-.683.461-1.117s-.156-.796-.462-1.103A1.5 1.5 0 0 0 12.296 7M8.55 10.797c.191 0 .369-.064.511-.206a.73.73 0 0 0 0-1.03.7.7 0 0 0-.512-.207.7.7 0 0 0-.505.207.71.71 0 0 0 0 1.03c.145.141.32.206.505.206M8.55 16.436a.95.95 0 0 0-.684.293.9.9 0 0 0-.284.668c0 .264.092.491.285.682q.288.29.682.292.394-.001.683-.292a.93.93 0 0 0 .284-.682.9.9 0 0 0-.284-.668.95.95 0 0 0-.683-.293M7.454 13.144a.8.8 0 0 0-.59-.248.83.83 0 0 0-.605.248.8.8 0 0 0-.241.598.827.827 0 0 0 .846.847.8.8 0 0 0 .59-.243.83.83 0 0 0 .25-.604.82.82 0 0 0-.25-.598"></path>
      </g>
      <defs>
        <clipPath id="clip0_1276_8094">
          <path fill="#fff" d="M6 7h13v13H6z"></path>
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <div className="w-[315px] h-[294px] bg-white border-2 border-white hover:border-[#107CFC4A] rounded-[15px] p-2">
      <div className="w-[297px] h-[210px] relative">
        <Image
          src={img}
          alt={head}
          width={297}
          height={210}
          className="w-full h-full object-cover rounded-[15px]"
        />
        {status ? done : pending}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="w-full">
          <p className="text-[22px] font-bold text-[#202020]">{head}</p>
          <p className="text-[12px]">{text}</p>
        </div>
        <Link
          href={link ? link : "#"}
          className="p-1 rounded-full bg-[#107CFC] border-4 border-[#F2F6FC] hover:translate-x-[2px] transition-all duration-300 hover:animate-pulse"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300`}
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};
