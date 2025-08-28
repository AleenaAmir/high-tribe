import React, { useState } from "react";
import { IoLink } from "react-icons/io5";
import { IoCopyOutline } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";
import { toast } from "react-hot-toast";
import GlobalModalBorderLess from "@/components/global/GlobalModalBorderLess";

interface InvitePeopleModalProps {
  isOpen: boolean;
  onClose: () => void;
  journeyId?: number;
  journeyName?: string;
}

const InvitePeopleModal: React.FC<InvitePeopleModalProps> = ({
  isOpen,
  onClose,
  journeyId,
  journeyName,
}) => {
  const [emails, setEmails] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [privacySetting, setPrivacySetting] = useState("Anyone");

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!emails.trim()) {
      toast.error("Please enter at least one email address");
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

      // TODO: Implement actual API call to invite people
      // const response = await apiRequest(`journeys/${journeyId}/invite`, {
      //   method: "POST",
      //   data: {
      //     emails: emailList,
      //     privacy: privacySetting
      //   }
      // });

      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Invitation sent to ${emailList.length} people!`);
      setEmails("");
      onClose();
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

  return (
    <GlobalModalBorderLess
      isOpen={isOpen}
      onClose={onClose}
      title="Invite People"
      maxWidth="max-w-2xl"
      customHeight="h-screen"
      customPadding="p-8"
    >
      {/* Description */}
      <p className="text-gray-600 text-sm mb-6">
        Create a group chat with friends or family and plan together
      </p>

      {/* Email Input */}
      <div className="mb-6">
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Email, comma separated..."
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
          rows={4}
        />
      </div>

      {/* Invite Button */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleInvite}
          disabled={isInviting || !emails.trim()}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          {isInviting ? "Inviting..." : "Invite"}
        </button>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <IoCopyOutline className="w-6 h-6 text-gray-600" />
          <span className="text-gray-700 text-base">Copy link</span>
        </button>

        {/* Privacy Setting */}
        <div className="flex items-center justify-between py-3 px-4 border border-gray-300 rounded-lg">
          <div className="flex items-center gap-3">
            <IoLink className="w-6 h-6 text-gray-600" />
            <span className="text-gray-700 text-base">{privacySetting}</span>
          </div>
          <IoChevronDown className="w-6 h-6 text-gray-600" />
        </div>
      </div>
    </GlobalModalBorderLess>
  );
};

export default InvitePeopleModal;
