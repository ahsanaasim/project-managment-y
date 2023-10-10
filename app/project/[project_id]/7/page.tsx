"use client";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import ScrollInput from "@/app/components/ScrollInput";
import Wrapper from "@/app/components/Wrapper";
import { useProjectContext } from "@/app/context/ProjectProvider";
import getStakeholderName from "@/app/helpers/getStakeholderName";
import useProjectId from "@/app/hooks/useProjectId";
import useProjectRef from "@/app/hooks/useProjectRef";
import { recommendationsStakeholder } from "@/global";
import { Button, Col, Input, Row, Space, Spin, Table, Typography } from "antd";
import { updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { FormEventHandler, useEffect, useState } from "react";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const [recommendationsGeneral, setRecommendationsGeneral] = useState(
    project.project_recommendations_general
  );
  const [tableData, setTableData] = useState<recommendationsStakeholder[]>(
    project.project_recommendations_stakeholder
  );
  const [updatingProject, setUpdatingProject] = useState(false);
  const getProjectRef = useProjectRef();
  const projectId = useProjectId();
  const router = useRouter();

  useEffect(() => {
    setRecommendationsGeneral(project.project_recommendations_general);
    setTableData(project.project_recommendations_stakeholder);
  }, [project]);

  const changeInput = (key: string, column: string, value: string) => {
    setTableData([
      ...tableData.map((row) => {
        if (row.key == key) {
          return { ...row, [column]: value };
        } else return { ...row };
      }),
    ]);
  };

  const saveRecommendations: FormEventHandler = async (e) => {
    e.preventDefault();
    setUpdatingProject(true);
    console.log(recommendationsGeneral, tableData);

    const projectDocRef = await getProjectRef(projectId);

    await updateDoc(projectDocRef, {
      project_recommendations_general: recommendationsGeneral,
      project_recommendations_stakeholder: tableData,
    });

    setProject({
      ...project,
      project_recommendations_general: recommendationsGeneral,
      project_recommendations_stakeholder: tableData,
    });

    router.push(`/project/1`);
  };

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <Wrapper>
          <Spin tip="Saving Recommendations" spinning={updatingProject}>
            <Typography.Title>Recommendations</Typography.Title>
            <form onSubmit={saveRecommendations}>
              <Space direction="vertical" style={{ display: "flex" }}>
                <label>General Recommendations</label>
                <Input.TextArea
                  value={recommendationsGeneral}
                  onChange={(e) => setRecommendationsGeneral(e.target.value)}
                ></Input.TextArea>
              </Space>
              <br />
              <Typography.Text>Stakeholder Recommendations</Typography.Text>
              <Table dataSource={tableData} pagination={false}>
                <Table.Column
                  title="Stakeholder"
                  dataIndex="project_recommendations_stakeholder_id"
                  key="project_recommendations_stakeholder_id"
                  render={(stakeholderId) => {
                    return getStakeholderName(stakeholderId, project);
                  }}
                />
                <Table.Column
                  title="Competencies"
                  dataIndex="project_recommendations_competencies"
                  key="project_recommendations_competencies"
                  render={(rowData, record: { key: string }, index) => (
                    // <Input
                    //   value={rowData}
                    //   onChange={(e) =>
                    //     changeInput(
                    //       record.key,
                    //       "project_recommendations_competencies",
                    //       e.target.value
                    //     )
                    //   }
                    // />

                    <ScrollInput
                      name="competencies"
                      value={rowData}
                      onChange={(e) =>
                        changeInput(
                          record.key,
                          "project_recommendations_competencies",
                          e.target.value
                        )
                      }
                    />
                  )}
                />
                <Table.Column
                  title="Resources"
                  dataIndex="project_recommendations_resources"
                  key="project_recommendations_resources"
                  render={(rowData, record: { key: string }, index) => (
                    // <Input
                    //   value={rowData}
                    //   onChange={(e) =>
                    //     changeInput(
                    //       record.key,
                    //       "project_recommendations_resources",
                    //       e.target.value
                    //     )
                    //   }
                    // />

                    <ScrollInput
                      name="resources"
                      value={rowData}
                      onChange={(e) =>
                        changeInput(
                          record.key,
                          "project_recommendations_resources",
                          e.target.value
                        )
                      }
                    />
                  )}
                />
                <Table.Column
                  render={() => <Button type="link">Send</Button>}
                />
              </Table>
              {/* <Space
                style={{
                  margin: "2rem 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  style={{ width: "200px" }}
                  href={`/project/${projectId}/6`}
                  type="primary"
                >
                  Back
                </Button>
                <Button style={{ width: "200px" }} type="primary">
                  Edit
                </Button>
                <Button
                  htmlType="submit"
                  style={{ width: "200px" }}
                  type="primary"
                >
                  Next
                </Button>
              </Space> */}
              <br />
              <br />
              <Footer withPrevious />
            </form>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
