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
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/app/firebase";
import useProjectRef from "@/app/hooks/useProject";
import useProjectId from "@/app/hooks/useProjectId";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import { useProjectContext } from "@/app/context/ProjectProvider";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { DeleteOutlined, FileOutlined } from "@ant-design/icons";
import FirebaseStorage from "firebase/storage";
import Footer from "@/app/components/Footer";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const [fileList, setFileList] = useState<FileList | null>();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState(project.project_documents);
  const [deleting, setDeleting] = useState(false);
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

  const deleteFile = async (fileLink: string) => {
    setDeleting(true);
    // deleting from db
    const projectRef = await getProjectRef(projectId);
    const newList = project.project_documents.filter(
      (link) => link != fileLink
    );
    await updateDoc(projectRef, {
      project_documents: [...newList],
    });

    // deleting from storage
    const fileRef = ref(storage, fileLink);
    await deleteObject(fileRef);

    setProject({
      ...project,
      project_documents: [...newList],
    });

    setDeleting(false);
    message.success("File deleted");
  };

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <Wrapper>
          <Spin tip="Uploading documents" spinning={uploading}>
            <Spin tip="Deleting file" spinning={deleting}>
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
                    <Button
                      onClick={() => deleteFile(docLink)}
                      icon={<DeleteOutlined />}
                      type="link"
                      danger
                    ></Button>
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
                {/* <ProjectFlowFooter previous={5} submitForm={uploadDocuments} /> */}
                <br />
                <br />
                <Footer withPrevious />
              </form>
            </Spin>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
