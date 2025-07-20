import MainStayLayout from "@/components/host/stay/MainStayLayout";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <MainStayLayout />
      </Suspense>
    </div>
  );
};

export default page;
