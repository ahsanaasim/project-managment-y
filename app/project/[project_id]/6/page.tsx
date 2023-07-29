"use client";
import Wrapper from "@/app/components/Wrapper";
import { Button, List, Spin, Typography, message } from "antd";
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
    setUploading(true);
    if (fileList) {
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
          // console.log(error instanceof FirebaseError ? error : error);
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
  };

  return (
    <Wrapper>
      <Spin tip="Uploading documents" spinning={uploading}>
        <Typography.Title>Upload Documents</Typography.Title>
        <List
          dataSource={documents}
          renderItem={(docLink) => (
            <List.Item>
              <Link target="_blank" href={docLink}>
                <Typography.Text style={{ width: "350px" }} ellipsis>
                  {docLink}
                </Typography.Text>
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
  );
};

export default Page;
