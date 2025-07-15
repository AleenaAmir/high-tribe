import GlobalModal from "@/components/global/GlobalModal";
import React from "react";
import NewAdvisory from "../components/newadvisory/NewAdvisory";

const MainAdvisory = ({
  advisoryModal,
  setAdvisoryModal,
}: {
  advisoryModal: boolean;
  setAdvisoryModal: (value: boolean) => void;
}) => {
  return (
    <GlobalModal
      isOpen={advisoryModal}
      onClose={() => setAdvisoryModal(false)}
      maxWidth="max-w-[1200px]"
      customPadding="p-0"
    >
      <NewAdvisory onClose={() => setAdvisoryModal(false)} />
    </GlobalModal>
  );
};

export default MainAdvisory;
