"use client";

import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import FullpageLoader from "../components/FullpageLoader";
import useGetCompany from "../hooks/useGetCompany";
import { useAppContext } from "./AppProvider";

const CompanyContext = createContext<Company>({
  company_id: "",
  company_name: "",
  company_admin_email: "",
  projects: [],
  users: [],
  roles: [],
});

const CompanyProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<Company>({
    company_id: "",
    company_name: "",
    company_admin_email: "",
    projects: [],
    users: [],
    roles: [],
  });
  const [loadingCompany, setLoadingCompany] = useState(true);
  const getCompany = useGetCompany();
  const { user } = useAppContext();

  useEffect(() => {
    (async () => {
      const company = await getCompany();

      if (!company) return null;

      setCompany(company as unknown as Company);
      setLoadingCompany(false);
    })();
  }, [user]);

  console.log(company);

  if (loadingCompany) return <FullpageLoader />;
  return (
    <CompanyContext.Provider value={company}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => useContext(CompanyContext);

export default CompanyProvider;
