"use client";
import Wrapper from "@/app/components/Wrapper";
import { Button, Col, List, Row, Space, Spin, Typography, message } from "antd";
import React, {
  ChangeEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import ProjectFlowFooter from "../ProjectFlowFooter";
import useUserId from "@/app/hooks/useUserId";
import { nanoid } from "nanoid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/app/firebase";
import useProjectRef from "@/app/hooks/useProjectRef";
import useProjectId from "@/app/hooks/useProjectId";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import { useProjectContext } from "@/app/context/ProjectProvider";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { FileOutlined } from "@ant-design/icons";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const [fileList, setFileList] = useState<FileList | null>();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState(project.project_documents);
  const getUserId = useUserId();
  const getProjectRef = useProjectRef();
  const projectId = useProjectId();
  const router = useRouter();

  useEffect(() => {
    setDocuments(project.project_documents);
  }, [project]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };

  const uploadDocuments: FormEventHandler = async (e) => {
    e.preventDefault();
    if (fileList) {
      setUploading(true);
      const filesArray = Array.from(fileList);
      const fileNames = [];

      for (const file of filesArray) {
        const fileName = `${await getUserId()}/${nanoid()}-${file.name}`;
        const fileRef = ref(storage, fileName);

        try {
          await uploadBytes(fileRef, file);
          const fileURL = await getDownloadURL(ref(storage, fileName));
          fileNames.push(fileURL);
        } catch (error) {
          message.error("Cannot upload file");
        }
      }

      const projectDocRef = await getProjectRef(projectId);

      await updateDoc(projectDocRef, {
        project_documents: fileNames,
      });

      setProject({
        ...project,
        project_documents: fileNames,
      });

      router.push(`/project/${projectId}/7`);
    }

    router.push(`/project/${projectId}/7`);
  };

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <Wrapper>
          <Spin tip="Uploading documents" spinning={uploading}>
            <Typography.Title>Upload Documents</Typography.Title>
            <List
              dataSource={documents}
              renderItem={(docLink, index) => (
                <List.Item>
                  <Link target="_blank" href={docLink}>
                    <Space>
                      <FileOutlined />
                      <Typography.Text>File {index + 1}</Typography.Text>
                    </Space>
                  </Link>
                </List.Item>
              )}
            />{" "}
            <br />
            <form onSubmit={uploadDocuments}>
              <input
                type="file"
                name="documents"
                id="documents"
                onChange={handleChange}
                multiple
              />
              <br />
              <br />
              <Button type="primary">Generate Recommendations</Button>
              <ProjectFlowFooter previous={5} submitForm={uploadDocuments} />
            </form>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
