"use client";
import Navbar from "@/app/components/Navbar";
import Wrapper from "@/app/components/Wrapper";
import { useProjectContext } from "@/app/context/ProjectProvider";
import { MinusCircleOutlined, ThunderboltFilled } from "@ant-design/icons";
import { Button, Col, Row, Spin, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";

const Page = () => {
  const { project } = useProjectContext();
  const [data, setData] = useState(project.project_raci_deliverables);

  const deleteRow = (key: string) => {
    setData([...data.filter((row) => row.key != key)]);
  };

  useEffect(() => {
    setData([...project.project_raci_deliverables]);
  }, [project]);

  const generateRecommendation = async (
    deliverable: ProjectRaciDeliverable1
  ) => {
    const recommendations = [];
    const inputs = ["responsible", "accountable", "consulted", "informed"];

    for (let i = 0; i < 4; i++) {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `In 100 words or fewer, describe the competencies a ${inputs[i]} stakeholder should have for the following deliverable: ${deliverable.project_raci_deliverable_name}`,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      recommendations.push(chatCompletion);
    }

    console.log(recommendations);
  };

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <Wrapper>
          <Spin tip="Saving RACI Recommendations" spinning={false}>
            <Typography.Title>RACI Recommendations</Typography.Title>
            <Button icon={<ThunderboltFilled />}>
              Generated Recommendations for All Deliverables
            </Button>
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
                // title="Deliverable"
                // dataIndex="project_raci_deliverable_name"
                // key="project_raci_deliverable_name"
                render={(rowData, record: { key: string }, index) => (
                  <Button
                    icon={
                      <ThunderboltFilled
                        onClick={() => generateRecommendation(rowData)}
                      />
                    }
                  />
                )}
              />
              <Table.Column
                title="Deliverable"
                dataIndex="project_raci_deliverable_name"
                key="project_raci_deliverable_name"
              />
              <Table.Column
                title="Responsible"
                dataIndex="project_raci_responsible_recommendations"
                key="project_raci_responsible_recommendations"
              />
              <Table.Column
                title="Accountable"
                dataIndex="project_raci_accountable_recommendations"
                key="project_raci_accountable_recommendations"
              />
              <Table.Column
                title="Consulted"
                dataIndex="project_raci_consulted_recommendations"
                key="project_raci_consulted_recommendations"
              />
              <Table.Column
                title="Informed"
                dataIndex="project_raci_informed_recommendations"
                key="project_raci_informed_recommendations"
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
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
