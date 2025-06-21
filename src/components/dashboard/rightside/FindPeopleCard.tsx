"use client";
import React from "react";

const FindPeopleCard = () => {
  return (
    <div className="bg-gradient-to-r from-[#FFC107] to-[#FB8500]  text-center rounded-lg shadow-md p-6 ">
      <h2 className="text-white text-[20px] text-left font-bold">
        Find your people with
        <br />
        Message
      </h2>
      <button className="mt-4 bg-gray-800 text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors">
        Start your 7 days free trial
      </button>
    </div>
  );
};

export default FindPeopleCard;
