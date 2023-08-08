"use client";
import { Spin } from "antd";
import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Spin />
    </div>
  );
};

export default Loading;
