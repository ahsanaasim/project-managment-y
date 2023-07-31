import { Spin } from "antd";
import React from "react";

const FullpageLoader = () => {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin />
    </main>
  );
};

export default FullpageLoader;
