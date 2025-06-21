"use client";
import React from "react";
import Image from "next/image";

// --- DUMMY DATA ---
const contactsData = [
  {
    name: "Alexander Smith",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Olivia Johnson",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Benjamin Williams",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Emily Brown",
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "Liam Davis",
    avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Sophia Martinez",
    avatarUrl: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    name: "Noah Wilson",
    avatarUrl: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    name: "William Taylor",
    avatarUrl: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  {
    name: "Jacob Harris",
    avatarUrl: "https://randomuser.me/api/portraits/men/9.jpg",
  },
];

// --- SVG ICON ---
const MoreOptionsIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="1.5" fill="#696969"></circle>
    <circle cx="6" cy="12" r="1.5" fill="#696969"></circle>
    <circle cx="18" cy="12" r="1.5" fill="#696969"></circle>
  </svg>
);

// --- MAIN COMPONENT ---
const ContactsList = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-lg">
          Contacts <span className="text-blue-600">{contactsData.length}</span>
        </h3>
        <button>
          <MoreOptionsIcon />
        </button>
      </div>
      <ul className="space-y-5">
        {contactsData.map((contact, index) => (
          <li
            key={index}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <Image
              src={contact.avatarUrl}
              alt={contact.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <p className="text-sm text-custom-gray font-semibold group-hover:text-gray-800 transition-colors">
              {contact.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsList;
