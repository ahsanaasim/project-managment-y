"use client";
import Wrapper from "@/app/components/Wrapper";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Typography, Upload } from "antd";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import React, { FormEventHandler } from "react";
import ProjectFlowFooter from "../ProjectFlowFooter";

const page = () => {
  const onFileUpload = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log(info);
  };

  const uploadDocuments: FormEventHandler = async (e) => {};

  return (
    <Wrapper>
      <Typography.Title>Upload Documents</Typography.Title>
      <Upload onChange={onFileUpload} multiple>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <br />
      <Button type="primary">Generate Recommendations</Button>
      <ProjectFlowFooter previous={5} submitForm={uploadDocuments} />
    </Wrapper>
  );
};

export default page;
