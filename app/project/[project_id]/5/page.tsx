"use client";
import Wrapper from "@/app/components/Wrapper";
import {
  Button,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { nanoid } from "nanoid";
import React, { FormEventHandler, useEffect, useState } from "react";
import {
  CloseOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import ProjectFlowFooter from "../ProjectFlowFooter";
import { WorkingGroup, WorkingGroupTable } from "@/global";
import { useProjectContext } from "@/app/context/ProjectProvider";
import { table } from "console";
import getStakeholderName from "@/app/helpers/getStakeholderName";
import useProjectRef from "@/app/hooks/useProjectRef";
import useProjectId from "@/app/hooks/useProjectId";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

// const stakeholders = ["name 1", "name 2", "name 3", "name 4"];

const Page = () => {
  const { project, setProject } = useProjectContext();
  const [tableData, setTableData] = useState<WorkingGroup[]>(
    project.project_working_groups
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [updatingProject, setUpdatingProject] = useState(false);
  const getProjectRef = useProjectRef();
  const projectId = useProjectId();
  const router = useRouter();

  useEffect(() => {
    setTableData(project.project_working_groups);
  }, [project]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setTableData([
      ...tableData,
      {
        project_working_group_id: nanoid(),
        project_working_group_title: newGroupName,
        project_working_group_item: [
          {
            key: nanoid(),
            project_working_group_role: "",
            project_working_group_responsibilities: "",
            project_working_group_stakeholders: [],
          },
        ],
      },
    ]);

    setNewGroupName("");
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onDragHandler = (e: React.DragEvent, stakeholder: string) => {
    e.dataTransfer.setData("text/plain", stakeholder);
  };

  const addTable = () => {
    showModal();
  };

  const handleOnDrop = (
    e: React.DragEvent,
    rowKey: string,
    tableKey: string
  ) => {
    setTableData([
      ...tableData.map((table) => {
        if (table.project_working_group_id == tableKey) {
          return {
            ...table,
            project_working_group_item: [
              ...table.project_working_group_item.map((row) => {
                if (row.key == rowKey) {
                  if (
                    row.project_working_group_stakeholders.includes(
                      e.dataTransfer.getData("text/plain")
                    )
                  )
                    return { ...row };
                  return {
                    ...row,
                    project_working_group_stakeholders: [
                      ...row.project_working_group_stakeholders,
                      e.dataTransfer.getData("text/plain"),
                    ],
                  };
                } else return { ...row };
              }),
            ],
          };
        } else return { ...table };
      }),
    ]);
  };

  const removeStakeholder = (
    stakeholderId: string,
    tableId: string,
    rowKey: string
  ) => {
    setTableData([
      ...tableData.map((table) => {
        if (table.project_working_group_id == tableId) {
          return {
            ...table,
            project_working_group_item: [
              ...table.project_working_group_item.map((row) => {
                if (row.key == rowKey) {
                  return {
                    ...row,
                    project_working_group_stakeholders:
                      row.project_working_group_stakeholders.filter(
                        (stakeholder) => stakeholder != stakeholderId
                      ),
                  };
                } else return { ...row };
              }),
            ],
          };
        } else return { ...table };
      }),
    ]);
  };

  const renderStakeholders = (
    rowData: string[],
    rowKey: string,
    tableKey: string
  ) => {
    return (
      <ul
        style={{ listStyle: "none", paddingInlineStart: 0 }}
        onDrop={(e) => handleOnDrop(e, rowKey, tableKey)}
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
                    {getStakeholderName(stakeholder, project)}{" "}
                    <CloseOutlined
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        removeStakeholder(stakeholder, tableKey, rowKey)
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

  const addRow = (tableId: string) => {
    console.log("adding row...");

    setTableData([
      ...tableData.map((table) => {
        if (table.project_working_group_id == tableId) {
          console.log(table.project_working_group_item);

          return {
            ...table,
            project_working_group_item: [
              ...table.project_working_group_item,
              {
                key: nanoid(),
                project_working_group_role: "",
                project_working_group_responsibilities: "",
                project_working_group_stakeholders: [],
              },
            ],
          };
        } else return { ...table };
      }),
    ]);
  };

  const deleteRow = (tableId: string, rowKey: string) => {
    setTableData([
      ...tableData.map((table) => {
        if (table.project_working_group_id == tableId) {
          return {
            ...table,
            project_working_group_item: [
              ...table.project_working_group_item.filter(
                (row) => row.key != rowKey
              ),
            ],
          };
        } else return { ...table };
      }),
    ]);
  };

  const saveWorkingGroups: FormEventHandler = async (e) => {
    e.preventDefault();
    setUpdatingProject(true);

    const projectDocRef = await getProjectRef(projectId);

    await updateDoc(projectDocRef, {
      project_working_groups: tableData,
    });

    setProject({
      ...project,
      project_working_groups: tableData,
    });

    router.push(`/project/${projectId}/6`);
  };

  const changeRoleResponsibility = (
    tableKey: string,
    rowKey: string,
    column: string,
    value: string
  ) => {
    setTableData([
      ...tableData.map((table) => {
        if (table.project_working_group_id == tableKey) {
          return {
            ...table,
            project_working_group_item: [
              ...table.project_working_group_item.map((row) => {
                if (row.key == rowKey) {
                  return { ...row, [column]: value };
                } else return { ...row };
              }),
            ],
          };
        } else return { ...table };
      }),
    ]);
  };

  const removeGroup = (tableId: string) => {
    setTableData([
      ...tableData.filter((table) => table.project_working_group_id != tableId),
    ]);
  };

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <Wrapper>
          <Spin spinning={updatingProject} tip="Saving working groups">
            <div>
              <Modal
                title="Create Working Group"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Working group name"
                />
              </Modal>
              <Typography.Title>Working Groups</Typography.Title>
              {project.project_stakeholders.length == 0 ? (
                <div>
                  <Typography.Text type="danger">
                    No Stakeholders
                  </Typography.Text>
                </div>
              ) : (
                <div>
                  <Typography.Text>Stakeholders</Typography.Text>
                </div>
              )}
              <ul style={{ listStyle: "none", paddingInlineStart: 0 }}>
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
              <form onSubmit={saveWorkingGroups}>
                {tableData.map((table, index) => {
                  return (
                    <div key={index} style={{ marginTop: "1rem" }}>
                      <Typography.Text>
                        <Space>
                          {table.project_working_group_title}{" "}
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              removeGroup(table.project_working_group_id)
                            }
                          ></Button>
                        </Space>
                      </Typography.Text>
                      <Table
                        dataSource={table.project_working_group_item}
                        style={{ marginTop: "2rem" }}
                        pagination={false}
                      >
                        <Table.Column
                          title="Role"
                          dataIndex="project_working_group_role"
                          key="project_working_group_role"
                          render={(rowData, record: { key: string }, index) => (
                            <Input
                              value={rowData}
                              onChange={(e) =>
                                changeRoleResponsibility(
                                  table.project_working_group_id,
                                  record.key,
                                  "project_working_group_role",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        />
                        <Table.Column
                          title="Responsibilities"
                          dataIndex="project_working_group_responsibilities"
                          key="project_working_group_responsibilities"
                          render={(rowData, record: { key: string }, index) => (
                            <Input
                              value={rowData}
                              onChange={(e) =>
                                changeRoleResponsibility(
                                  table.project_working_group_id,
                                  record.key,
                                  "project_working_group_responsibilities",
                                  e.target.value
                                )
                              }
                            />
                          )}
                        />
                        <Table.Column
                          title="Stakeholders"
                          dataIndex="project_working_group_stakeholders"
                          key="project_working_group_stakeholders"
                          render={(rowData, record: { key: string }, index) =>
                            renderStakeholders(
                              rowData,
                              record.key,
                              table.project_working_group_id
                            )
                          }
                        />
                        <Table.Column
                          render={(rowData, record: { key: string }, index) => (
                            <Button
                              onClick={() =>
                                deleteRow(
                                  table.project_working_group_id,
                                  record.key
                                )
                              }
                              icon={<MinusCircleOutlined />}
                              danger
                            ></Button>
                          )}
                        />
                      </Table>
                      <br />
                      <Button
                        onClick={() => addRow(table.project_working_group_id)}
                        icon={<PlusCircleOutlined />}
                      >
                        Add Row
                      </Button>
                      <Divider />
                    </div>
                  );
                })}
                <br />
                <Button
                  type="primary"
                  onClick={addTable}
                  icon={<PlusCircleOutlined />}
                >
                  Add Working Group
                </Button>
                <ProjectFlowFooter
                  previous={4}
                  submitForm={saveWorkingGroups}
                />
              </form>
            </div>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
