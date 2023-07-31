"use client";
import { useEffect } from "react";
import { useAppContext } from "./context/AppProvider";
import { useRouter } from "next/navigation";
import FullpageLoader from "./components/FullpageLoader";

export default function Home() {
  const { user, loadingUser } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!loadingUser) {
      if (user) router.push("/project/1");
      else router.push("/auth");
    }
  }, [loadingUser]);

  return <FullpageLoader />;
}
