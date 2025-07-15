import GlobalModal from "@/components/global/GlobalModal";
import React from "react";
import NewFootprint from "../components/newfootprint/NewFootprint";

const MainFootprint = ({
  footprintModal,
  setFootprintModal,
}: {
  footprintModal: boolean;
  setFootprintModal: (value: boolean) => void;
}) => {
  return (
    <GlobalModal
      isOpen={footprintModal}
      onClose={() => setFootprintModal(false)}
      maxWidth="max-w-[1200px]"
      customPadding="p-0"
    >
      <NewFootprint onClose={() => setFootprintModal(false)} />
    </GlobalModal>
  );
};

export default MainFootprint;
