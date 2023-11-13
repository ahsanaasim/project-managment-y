"use client";
import Wrapper from "@/app/components/Wrapper";
import { Col, Input, Modal, Row, Space, Spin, Typography, message } from "antd";
import { updateDoc } from "firebase/firestore";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEventHandler, useEffect, useState } from "react";
import useProjectRef from "@/app/hooks/useProjectRef";
import { useProjectContext } from "@/app/context/ProjectProvider";
import Navbar from "@/app/components/Navbar";
import ScrollInput from "@/app/components/ScrollInput";
import Footer from "@/app/components/Footer";
import useProject from "@/app/hooks/useProject";
import { ExclamationCircleFilled } from "@ant-design/icons";
import useNextConfirmation from "@/app/hooks/useNextConfirmation";
import { useAppContext } from "@/app/context/AppProvider";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const { user } = useAppContext();
  const [overview, setOverview] = useState(project.project_overview);
  const [problem, setProblem] = useState(project.project_problem);
  const [purpose, setPurpose] = useState(project.project_purpose);
  const [scope, setScope] = useState(project.project_scope);
  const [projectLink, setProjectLink] = useState(project.project_link_to_plan);
  const [updatingProject, setUpdatingProject] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const projectId = path.split("/")[2];
  const getProjectRef = useProjectRef();
  const getProject = useProject();
  const showConfirm = useNextConfirmation();

  // const showConfirm = () => {
  //   const { confirm } = Modal;

  //   confirm({
  //     title: "You have unsaved changes.",
  //     icon: <ExclamationCircleFilled />,
  //     // content: 'Some descriptions',
  //     okText: "Continue without Saving",
  //     cancelText: "Cancel",
  //     onOk() {
  //       router.push(`/project/${projectId}/3`);
  //     },
  //   });
  // };

  const createProjectDetails: FormEventHandler = async (e) => {
    if (!user) return;
    e.preventDefault();
    setUpdatingProject(true);

    const projectRef = await getProjectRef(projectId, user);

    await updateDoc(projectRef, {
      project_overview: overview,
      project_problem: problem,
      project_purpose: purpose,
      project_scope: scope,
      project_link_to_plan: projectLink,
    });

    setProject({
      ...project,
      project_overview: overview,
      project_problem: problem,
      project_purpose: purpose,
      project_scope: scope,
      project_link_to_plan: projectLink,
    });

    setUpdatingProject(false);
    message.success("Changes saved");
  };

  const saveConfirmation = async () => {
    if (!user) return;
    console.log("running");

    const projectInDB = await getProject(user, projectId);
    const {
      project_overview,
      project_problem,
      project_purpose,
      project_scope,
      project_link_to_plan,
    } = projectInDB as Project;

    console.log("project from db", projectInDB);
    console.log("project from local", project);

    if (
      project_overview !== overview ||
      project_problem !== problem ||
      project_purpose !== purpose ||
      project_scope !== scope ||
      project_link_to_plan !== projectLink
    ) {
      showConfirm(projectId, 3);
    } else router.push(`/project/${projectId}/3`);
  };

  useEffect(() => {
    setOverview(project.project_overview);
    setProblem(project.project_problem);
    setPurpose(project.project_purpose);
    setScope(project.project_scope);
    setProjectLink(project.project_link_to_plan);
  }, [project]);

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <main>
          <Wrapper>
            <Spin spinning={updatingProject} tip="Saving details">
              <Typography.Title>{project.project_name}</Typography.Title>
              <form onSubmit={createProjectDetails}>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ display: "flex", width: "50%" }}
                >
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <label htmlFor="overview">Overview</label>

                    <ScrollInput
                      name="overview"
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                    />
                  </Space>
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <label htmlFor="problem">Problem</label>

                    <ScrollInput
                      name="problem"
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                    />
                  </Space>
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <label htmlFor="purpose">Purpose</label>

                    <ScrollInput
                      name="purpose"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                    />
                  </Space>
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <label htmlFor="scope">Scope</label>

                    <ScrollInput
                      name="scope"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                    />
                  </Space>
                  <Space direction="vertical" style={{ display: "flex" }}>
                    <label htmlFor="project-link">Link to Project Plan</label>
                    <Input
                      type="url"
                      name="project-link"
                      id="project-link"
                      value={projectLink}
                      onChange={(e) => setProjectLink(e.target.value)}
                    />
                  </Space>
                  {/* <Button htmlType="submit" type="primary" block>
                    Next
                  </Button> */}
                  <Footer
                    saveHandler={createProjectDetails}
                    confirmationHandlerNext={saveConfirmation}
                  />
                </Space>
              </form>
            </Spin>
          </Wrapper>
        </main>
      </Col>
    </Row>
  );
};

export default Page;
