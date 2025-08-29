import React, { useState } from "react";
import { IoLink } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import GlobalModalBorderLess from "@/components/global/GlobalModalBorderLess";
import { apiFormDataWrapper } from "@/lib/api";

interface InvitePeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId?: number;
  journeyName?: string;
}

interface InvitedPerson {
  id: string;
  email: string;
  status: "pending" | "sent" | "accepted";
  avatar?: string;
}

export const shareIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    fill="none"
    viewBox="0 0 17 16"
  >
    <path
      stroke="#1C1C24"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.166 4.003H4.499c-.736 0-1.333.597-1.333 1.333v6.667c0 .736.597 1.333 1.333 1.333h6.667c.736 0 1.333-.597 1.333-1.333V9.336M9.833 2.67h4m0 0v4m0-4L7.166 9.336"
    ></path>
  </svg>
);

export const linkIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="12"
    fill="none"
    viewBox="0 0 13 12"
  >
    <path
      fill="url(#paint0_linear_6191_26467)"
      d="M7.366 4.228a.56.56 0 0 0-.777.17.56.56 0 0 0 .17.777c.542.348.866.938.866 1.578 0 .501-.195.972-.549 1.326l-2.25 2.25c-.354.354-.825.55-1.326.55a1.877 1.877 0 0 1-1.326-3.201L3.241 6.61a.563.563 0 1 0-.795-.795L1.38 6.882A2.98 2.98 0 0 0 .5 9.003c0 1.655 1.346 3 3 3a2.98 2.98 0 0 0 2.121-.879l2.25-2.25c.567-.565.879-1.32.879-2.12 0-1.026-.517-1.97-1.384-2.526M9.5.003a2.98 2.98 0 0 0-2.121.88l-2.25 2.25a2.98 2.98 0 0 0-.879 2.12 2.99 2.99 0 0 0 1.384 2.526.56.56 0 0 0 .777-.17.56.56 0 0 0-.17-.777 1.87 1.87 0 0 1-.317-2.905l2.25-2.25a1.877 1.877 0 0 1 2.652 2.651L9.759 5.397a.563.563 0 1 0 .795.795l1.067-1.067c.567-.566.879-1.32.879-2.12 0-1.655-1.346-3-3-3"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_6191_26467"
        x1="0.5"
        x2="12.5"
        y1="5.021"
        y2="5.179"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#9243AC"></stop>
        <stop offset="0.507" stopColor="#B6459F"></stop>
        <stop offset="1" stopColor="#E74294"></stop>
      </linearGradient>
    </defs>
  </svg>
);

const InvitePeopleModal: React.FC<InvitePeopleModalProps> = ({
  isOpen,
  onClose,
  journeyId,
  journeyName,
}) => {
  const [emails, setEmails] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [privacySetting, setPrivacySetting] = useState("Anyone");
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const [invitedPeople, setInvitedPeople] = useState<InvitedPerson[]>([]);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!emails.trim()) {
      toast.error("Please enter at least one email address");
      return;
    }

    if (!journeyId) {
      toast.error("Journey ID is required");
      return;
    }

    setIsInviting(true);
    try {
      // Parse emails (comma-separated)
      const emailList = emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emailList.filter(
        (email) => !emailRegex.test(email)
      );

      if (invalidEmails.length > 0) {
        toast.error(`Invalid email format: ${invalidEmails.join(", ")}`);
        return;
      }

      // Send invitation for each email
      for (const email of emailList) {
        const formData = new FormData();
        formData.append("email", email);

        try {
          await apiFormDataWrapper(
            `journeys/${journeyId}/invite`,
            formData,
            `Invitation sent to ${email}!`,
            { method: "POST" }
          );

          // Add to invited people list
          const newInvitedPerson = {
            id: Date.now().toString() + Math.random(),
            email,
            status: "sent" as const,
            avatar: "/dashboard/Profile.svg",
          };

          setInvitedPeople((prev) => [...prev, newInvitedPerson]);
        } catch (error) {
          console.error(`Failed to invite ${email}:`, error);
          // Continue with other emails even if one fails
        }
      }

      setEmails("");
    } catch (error) {
      console.error("Error sending invitations:", error);
      toast.error("Failed to send invitations. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const inviteLink = `${window.location.origin}/journey/${journeyId}/invite`;
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleInvite();
    }
  };

  const handlePrivacyChange = (setting: string) => {
    setPrivacySetting(setting);
    setShowPrivacyDropdown(false);
  };

  return (
    <GlobalModalBorderLess
      isOpen={isOpen}
      onClose={onClose}
      title="Invite People"
      maxWidth="max-w-2xl"
      customHeight="h-auto"
      customPadding="p-8"
    >
      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">
        Create a group chat with friends or family and plan together
      </p>

      {/* Email Input Section */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Email, comma separated...."
              className="w-full p-4 border border-purple-500 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
            />
          </div>
          <button
            onClick={handleInvite}
            disabled={isInviting || !emails.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-8 rounded-full font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base whitespace-nowrap"
          >
            {isInviting ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>

      {/* Invited People List */}
      {invitedPeople.length > 0 && (
        <div className="mb-6">
          {invitedPeople.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg mb-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <img
                    src={person.avatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLElement;
                      target.style.display = "none";
                      const nextElement =
                        target.nextElementSibling as HTMLElement;
                      if (nextElement) {
                        nextElement.style.display = "flex";
                      }
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium"
                    style={{ display: "none" }}
                  >
                    {person.email.charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="text-gray-700 text-base">{person.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Invite Sent
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Copy Link and Privacy Section */}
      <div className="flex items-center justify-between text-[#1E1D1D] text-[10px] font-medium">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-start gap-1"
        >
          {shareIcon}
          <span className="">Copy link</span>
        </button>

        {/* Privacy Setting */}
        <div className="relative">
          <button
            onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
            className="w-full flex items-center justify-between "
          >
            <div className="flex items-center gap-1">
              {privacySetting === "Invite only" ? shareIcon : linkIcon}
              <span className="">{privacySetting}</span>
            </div>
            <IoChevronDown className="w-4 h-4 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showPrivacyDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[300px]">
              <button
                onClick={() => handlePrivacyChange("Invite only")}
                className="w-full flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition-colors"
              >
                {shareIcon}
                <span className="text-gray-700 text-base">Invite only</span>
              </button>
              <button
                onClick={() => handlePrivacyChange("Anyone with a link")}
                className="w-full flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition-colors"
              >
                {linkIcon}
                <span className="text-gray-700 text-base">
                  Anyone with a link
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </GlobalModalBorderLess>
  );
};

export default InvitePeopleModal;
