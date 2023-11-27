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
import useProjectRef from "@/app/hooks/useProjectRef";
import useProjectId from "@/app/hooks/useProjectId";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import { useProjectContext } from "@/app/context/ProjectProvider";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { DeleteOutlined, FileOutlined } from "@ant-design/icons";
import FirebaseStorage from "firebase/storage";
import Footer from "@/app/components/Footer";
import useProject from "@/app/hooks/useProject";
import useNextConfirmation from "@/app/hooks/useNextConfirmation";
import { useAppContext } from "@/app/context/AppProvider";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const { user } = useAppContext();
  const [fileList, setFileList] = useState<FileList | null>();
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState(project.project_documents);
  const [deleting, setDeleting] = useState(false);
  const getUserId = useUserId();
  const getProjectRef = useProjectRef();
  const getProject = useProject();
  const projectId = useProjectId();
  const router = useRouter();
  const showConfirm = useNextConfirmation();

  useEffect(() => {
    setDocuments(project.project_documents);
  }, [project]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files);
  };

  const uploadDocuments: FormEventHandler = async (e) => {
    if (!user) return;
    e.preventDefault();
    if (fileList) {
      setUploading(true);
      const filesArray = Array.from(fileList);
      const fileNames = [];

      for (const file of filesArray) {
        const fileName = `${await getUserId()}/${nanoid()}-${file.name}`;
        const fileRef = ref(storage, fileName);
        console.log(fileName);

        try {
          await uploadBytes(fileRef, file);
          const fileURL = await getDownloadURL(ref(storage, fileName));
          fileNames.push(fileURL);
        } catch (error) {
          message.error("Cannot upload file");
        }
      }

      const projectDocRef = await getProjectRef(projectId, user);

      await updateDoc(projectDocRef, {
        project_documents: [...documents, ...fileNames],
      });

      setProject({
        ...project,
        project_documents: [...documents, ...fileNames],
      });

      // router.push(`/project/${projectId}/7`);
      setUploading(false);
      message.success("Uploaded");
      setFileList(undefined);
    } else {
      // router.push(`/project/${projectId}/7`);
      setUploading(false);
      message.success("Saved");
    }
  };

  const deleteFile = async (fileLink: string) => {
    if (!user) return;
    setDeleting(true);
    // deleting from db
    const projectRef = await getProjectRef(projectId, user);
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

    setDocuments([...newList]);

    setDeleting(false);
    message.success("File deleted");
  };

  const saveConfirmation = async (isNext: boolean) => {
    if (!user) return;
    console.log("rungionon");

    const goingTo = isNext ? 7 : 5;
    const projectInDB = (await getProject(user, projectId)) as Project;

    if (
      JSON.stringify(projectInDB.project_documents) !==
        JSON.stringify(documents) ||
      documents.length + (fileList ? fileList.length : 0) !==
        projectInDB.project_documents.length
    ) {
      showConfirm(projectId, goingTo);
    } else router.push(`/project/${projectId}/${goingTo}`);
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
                {fileList ? (
                  <input
                    type="file"
                    name="documents"
                    id="documents"
                    onChange={handleChange}
                    multiple
                  />
                ) : (
                  <input
                    type="file"
                    name="documents"
                    id="documents"
                    onChange={handleChange}
                    value=""
                    multiple
                  />
                )}
                {/* <input
                  type="file"
                  name="documents"
                  id="documents"
                  onChange={handleChange}
                  value={""}
                  multiple
                /> */}
                <br />
                <br />
                <Button type="primary">Generate Recommendations</Button>
                {/* <ProjectFlowFooter previous={5} submitForm={uploadDocuments} /> */}
                <br />
                <br />
                <Footer
                  saveHandler={uploadDocuments}
                  confirmationHandlerNext={() => saveConfirmation(true)}
                  confirmationHandlerPrevious={() => saveConfirmation(false)}
                />
              </form>
            </Spin>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
