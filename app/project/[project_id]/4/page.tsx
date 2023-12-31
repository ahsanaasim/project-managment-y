"use client";
import Wrapper from "@/app/components/Wrapper";
import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { nanoid } from "nanoid";
import React, { FormEventHandler, useEffect, useState } from "react";
import AddRowButton from "../AddRowButton";
import ProjectFlowFooter from "../ProjectFlowFooter";
import { CloseOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useProjectContext } from "@/app/context/ProjectProvider";
import useProjectRef from "@/app/hooks/useProjectRef";
import useProjectId from "@/app/hooks/useProjectId";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";
import ScrollInput from "@/app/components/ScrollInput";
import Footer from "@/app/components/Footer";
import useProject from "@/app/hooks/useProject";
import useNextConfirmation from "@/app/hooks/useNextConfirmation";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const [updatingProject, setUpdatingProject] = useState(false);
  const getProjectRef = useProjectRef();
  const projectId = useProjectId();
  const router = useRouter();
  const getProject = useProject();
  const showConfirm = useNextConfirmation();
  const [data, setData] = useState<ProjectRaciDeliverable1[]>(
    project.project_raci_deliverables
  );

  const handleOnDrop = (
    e: React.DragEvent,
    column: keyof ProjectRaciDeliverable1,
    rowKey: string
  ) => {
    setData([
      ...data.map((row) => {
        if (row.key == rowKey) {
          if (row[column].includes(e.dataTransfer.getData("text/plain")))
            return { ...row };

          return {
            ...row,
            [column]: [
              ...(row[column] as string[]),
              e.dataTransfer.getData("text/plain"),
            ],
          };
        } else return { ...row };
      }),
    ]);
  };

  const onDragHandler = (
    e: React.DragEvent,
    // stakeholderName: string,
    stakeholderId: string
  ) => {
    e.dataTransfer.setData("text/plain", stakeholderId);
  };

  const removeStakeholder = (
    name: string,
    rowKey: string,
    column: keyof ProjectRaciDeliverable1
  ) => {
    setData([
      ...data.map((row) => {
        if (rowKey == row.key) {
          return {
            ...row,
            [column]: [
              ...(row[column] as string[]).filter(
                (stakeholder) => stakeholder != name
              ),
            ],
          };
        } else return { ...row };
      }),
    ]);
  };

  const getStakeholderName = (id: string) => {
    return project.project_stakeholders.filter(
      (stakeholder) => stakeholder.project_stakeholder_id == id
    )[0].project_stakeholder_name;
  };

  const renderStakeholders = (
    rowData: string[],
    rowKey: string,
    column: keyof ProjectRaciDeliverable1
  ) => {
    return (
      <ul
        style={{ listStyle: "none", paddingInlineStart: 0 }}
        onDrop={(e) => handleOnDrop(e, column, rowKey)}
        onDragOver={(e) => e.preventDefault()}
      >
        {rowData.length == 0 ? (
          <Tag>Drop Here</Tag>
        ) : (
          <Space size={[0, 8]} wrap>
            {rowData.map((stakeholder, index) => {
              return (
                <li
                  key={index}
                  style={{
                    listStylePosition: "inside",
                    display: "inline-block",
                  }}
                >
                  <Tag color="blue">
                    {getStakeholderName(stakeholder)}{" "}
                    <CloseOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        removeStakeholder(stakeholder, rowKey, column)
                      }
                    />
                  </Tag>
                </li>
              );
            })}
          </Space>
        )}
      </ul>
    );
  };

  const addRow = () => {
    setData([
      ...data,
      {
        key: nanoid(),
        project_raci_deliverable_name: "",
        project_raci_responsible_stakeholder_ids: [],
        project_raci_accountable_stakeholder_ids: [],
        project_raci_consulted_stakeholder_ids: [],
        project_raci_informed_stakeholder_ids: [],
        project_raci_responsible_recommendations: "",
        project_raci_accountable_recommendations: "",
        project_raci_consulted_recommendations: "",
        project_raci_informed_recommendations: "",
      },
    ]);
  };

  const deleteRow = (key: string) => {
    setData([...data.filter((row) => row.key != key)]);
  };

  const saveRaci: FormEventHandler = async (e) => {
    e.preventDefault();

    setUpdatingProject(true);

    const projectDocRef = await getProjectRef(projectId);

    await updateDoc(projectDocRef, {
      project_raci_deliverables: data,
    });

    setProject({
      ...project,
      project_raci_deliverables: data,
    });

    router.push(`/project/${projectId}/5`);
  };

  const changeDeliverable = (rowKey: string, deliverable: string) => {
    setData([
      ...data.map((row) => {
        if (row.key == rowKey) {
          return { ...row, project_raci_deliverables: deliverable };
        } else return { ...row };
      }),
    ]);
  };

  useEffect(() => {
    setData([...project.project_raci_deliverables]);
  }, [project]);

  const saveConfirmation = async (isNext: boolean) => {
    const goingTo = isNext ? 5 : 3;
    const projectInDB = (await getProject(projectId)) as Project;

    if (
      JSON.stringify(projectInDB.project_raci_deliverables) !==
      JSON.stringify(data)
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
          <Spin tip="Saving RACI items" spinning={updatingProject}>
            <Typography.Title>RACI Stakeholders</Typography.Title>
            {/* <Typography.Text>Stakeholders</Typography.Text> */}
            {project.project_stakeholders.length == 0 ? (
              <div>
                <Typography.Text type="danger">No Stakeholders</Typography.Text>
              </div>
            ) : (
              <div>
                <Typography.Text>Stakeholders</Typography.Text>
              </div>
            )}
            <ul
              style={{
                listStyle: "none",
                // position: "fixed",
                // top: 0,
                paddingInlineStart: 0,
              }}
            >
              <Space size={[0, 8]} wrap>
                {project.project_stakeholders.map((stakeholder, index) => {
                  return (
                    <li
                      key={index}
                      style={{
                        listStylePosition: "inside",
                        display: "inline-block",
                        cursor: "grabbing",
                      }}
                      draggable
                      onDragStart={(e) =>
                        onDragHandler(e, stakeholder.project_stakeholder_id)
                      }
                    >
                      <Tag color="blue">
                        {stakeholder.project_stakeholder_name}
                      </Tag>
                    </li>
                  );
                })}
              </Space>
            </ul>
            <form>
              {data.length !== 0 && (
                <Table
                  dataSource={data}
                  style={{
                    marginTop: "2rem",
                    maxHeight: "500px",
                    overflowY: "scroll",
                  }}
                  pagination={false}
                >
                  <Table.Column
                    title="Deliverable"
                    dataIndex="project_raci_deliverable"
                    key="project_raci_deliverable"
                    render={(rowData, record: { key: string }, index) => (
                      // <Input
                      //   value={rowData}
                      //   onChange={(e) =>
                      //     changeDeliverable(record.key, e.target.value)
                      //   }
                      // />
                      <ScrollInput
                        name="deliverable"
                        value={rowData}
                        onChange={(e) =>
                          changeDeliverable(record.key, e.target.value)
                        }
                      />
                    )}
                  />
                  <Table.Column
                    title="Responsible"
                    dataIndex="project_raci_responsible_stakeholder_ids"
                    key="project_raci_responsible_stakeholder_ids"
                    render={(rowData, record: { key: string }, index) =>
                      renderStakeholders(
                        rowData,
                        record.key,
                        "project_raci_responsible_stakeholder_ids"
                      )
                    }
                  />
                  <Table.Column
                    title="Accountable"
                    dataIndex="project_raci_accountable_stakeholder_ids"
                    key="project_raci_accountable_stakeholder_ids"
                    render={(rowData, record: { key: string }, index) =>
                      renderStakeholders(
                        rowData,
                        record.key,
                        "project_raci_accountable_stakeholder_ids"
                      )
                    }
                  />
                  <Table.Column
                    title="Consulted"
                    dataIndex="project_raci_consulted_stakeholder_ids"
                    key="project_raci_consulted_stakeholder_ids"
                    render={(rowData, record: { key: string }, index) =>
                      renderStakeholders(
                        rowData,
                        record.key,
                        "project_raci_consulted_stakeholder_ids"
                      )
                    }
                  />
                  <Table.Column
                    title="Informed"
                    dataIndex="project_raci_informed_stakeholder_ids"
                    key="project_raci_informed_stakeholder_ids"
                    render={(rowData, record: { key: string }, index) =>
                      renderStakeholders(
                        rowData,
                        record.key,
                        "project_raci_informed_stakeholder_ids"
                      )
                    }
                  />
                  <Table.Column
                    render={(rowData, record: { key: string }, index) => (
                      <Button
                        onClick={() => deleteRow(record.key)}
                        icon={<MinusCircleOutlined />}
                        danger
                      ></Button>
                    )}
                  />
                </Table>
              )}
              <br />
              <br />
              <AddRowButton addRow={addRow} />
              {/* <ProjectFlowFooter previous={3} submitForm={saveRaci} /> */}
              <br />
              <br />
              <Footer
                confirmationHandlerPrevious={() => saveConfirmation(false)}
                confirmationHandlerNext={() => saveConfirmation(true)}
                saveHandler={saveRaci}
              />
            </form>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
