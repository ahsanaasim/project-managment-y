import React, { FC } from "react";
import CompanyProvider from "../context/CompanyProvider";

const CompanyLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <CompanyProvider>{children}</CompanyProvider>;
};

export default CompanyLayout;
