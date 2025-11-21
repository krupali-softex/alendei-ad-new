import React from "react";
import { Outlet } from "react-router-dom";

const SectionWrapper: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default SectionWrapper;
