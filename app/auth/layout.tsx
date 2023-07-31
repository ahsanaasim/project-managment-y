"use client";
import { useEffect } from "react";
import FullpageLoader from "../components/FullpageLoader";
import NoSSR from "../components/NoSSR";
import TopMenu from "../components/TopMenu";
import { useAppContext } from "../context/AppProvider";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, loadingUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser) {
      if (user) router.push("/project/1");
    }
  }, [loadingUser]);

  if (loadingUser || user) return <FullpageLoader />;

  return (
    <NoSSR>
      <TopMenu />
      {children}
    </NoSSR>
  );
};

export default Layout;
