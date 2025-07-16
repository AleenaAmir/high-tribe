import GlobalModal from "@/components/global/GlobalModal";
import React from "react";
import NewTip from "../components/newtip/NewTip";

const MainTip = ({
  tipModal,
  setTipModal,
}: {
  tipModal: boolean;
  setTipModal: (value: boolean) => void;
}) => {
  return (
    <GlobalModal
      isOpen={tipModal}
      onClose={() => setTipModal(false)}
      maxWidth="max-w-[1200px]"
      customPadding="p-0"
    >
      <NewTip onClose={() => setTipModal(false)} />
    </GlobalModal>
  );
};

export default MainTip;
