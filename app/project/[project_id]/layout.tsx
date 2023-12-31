"use client";
import React, { useEffect, useState } from "react";
import { Col, Row, Spin } from "antd";
import Navbar from "../../components/Navbar";
import NoSSR from "../../components/NoSSR";
import TopMenu from "../../components/TopMenu";
import { usePathname, useRouter } from "next/navigation";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import ProjectProvider from "@/app/context/ProjectProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | User>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      // console.log(currentUser);
      if (!currentUser) router.push("/auth/login");

      setLoading(false);
      setUser(currentUser);
    });
  }, [router, path]);

  return (
    <NoSSR>
      <main>
        <TopMenu />
        {(loading || (!loading && !user)) && (
          <div
            style={{
              minHeight: "70vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin tip="Loading" />
          </div>
        )}
        {!loading && user && (
          // <Row>
          //   <Col span={4}>
          //     <Navbar />
          //   </Col>
          //   <Col span={20}>
          <ProjectProvider>{children}</ProjectProvider>
          //   </Col>
          // </Row>
        )}
      </main>
    </NoSSR>
  );
};

export default Layout;
