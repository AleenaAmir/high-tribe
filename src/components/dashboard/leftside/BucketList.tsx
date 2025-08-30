import React, { useState } from 'react';
import { ChevronUp, Heart } from 'lucide-react';
import Image from 'next/image';

const BucketList = () => {
  const [showBucketList, setShowBucketList] = useState(false);
  const [bucketItems] = useState([
    {
      id: 1,
      title: "Dream Apartment",
      saved: "208 saved",
      image: "/dashboard/b-1.svg",
      isLiked: true
    },
    {
      id: 2,
      title: "Fashion Inspiration",
      saved: "175 saved",
      image: "/dashboard/b-2.svg",
      isLiked: false
    },
    {
      id: 3,
      title: "Pretty Florals",
      saved: "125 saved",
      image: "/dashboard/b-3.svg",
      isLiked: false
    },
    {
      id: 4,
      title: "Pretty Florals",
      saved: "125 saved",
      image: "/dashboard/b-4.svg",
      isLiked: false
    }
  ]);

  const [items, setItems] = useState(bucketItems);

  const toggleLike = (id: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isLiked: !item.isLiked } : item
    ));
  };

  const toggleBucketList = () => {
    setShowBucketList(!showBucketList);
  };

  return (
    <div className={`w-full mx-auto bg-[#FFFFFF] border border-[#F2F2F1] p-4 mb-2 rounded-lg shadow-sm font-gilroy transition-all duration-300 `}>


      <div className="flex justify-between items-center">
        <h1 className="text-[16px] font-[500] text-[#000000]font-gilroy ">Bucket List</h1>
        <div className="relative">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-br from-[#9243AC] via-[#B6459F] to-[#E74294] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={toggleBucketList}
          >
            <img
              src="/dashboard/upArrow.svg"
              alt="Arrow"
              className={`w-3 h-3 transition-transform duration-200 ${showBucketList ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {showBucketList && (
        <div className="space-y-3 pt-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between py-2 relative">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>

              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 ">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-gilroy font-medium text-gray-800 leading-[100%] tracking-[0%] capitalize mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-gilroy font-medium text-gray-500 leading-[100%] tracking-[0%] capitalize">
                    {item.saved}
                  </p>
                </div>
              </div>


              <button
                onClick={() => toggleLike(item.id)}
                className="p-1.5 hover:bg-gray-50 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${item.isLiked
                    ? 'text-red-500 fill-red-500'
                    : 'text-[#DCDCDC] fill-[#DCDCDC]'
                    }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default BucketList;