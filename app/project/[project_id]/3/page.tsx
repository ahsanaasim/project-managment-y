"use client";
import Wrapper from "@/app/components/Wrapper";
import { Button, Col, Input, Row, Space, Spin, Typography } from "antd";
import React, { FormEvent, FormEventHandler, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ProjectFlowFooter from "../ProjectFlowFooter";
import { useProjectContext } from "@/app/context/ProjectProvider";
import { OutcomeMetric, Stakeholder } from "@/global";
import useProjectRef from "@/app/hooks/useProjectRef";
import { usePathname, useRouter } from "next/navigation";
import useProjectId from "@/app/hooks/useProjectId";
import { updateDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const [budget, setBudget] = useState("");
  const [outcomes, setOutcomes] = useState<OutcomeMetric[]>(
    project.project_outcomes_and_metrics
  );
  const [stakeHolders, setStakeHolders] = useState<Stakeholder[]>(
    project.project_stakeholders
  );
  const [updatingProject, setUpdatingProject] = useState(false);
  const getProjectRef = useProjectRef();
  const projectId = useProjectId();
  const router = useRouter();

  const removeField = (id: string) => {
    setOutcomes([...outcomes.filter((outcome) => outcome.item_id != id)]);
  };

  const addField = () => {
    setOutcomes([
      ...outcomes,
      {
        project_outcome: "",
        project_metric: "",
        item_id: nanoid(),
      },
    ]);
  };

  const removeStakeholderField = (id: string) => {
    setStakeHolders([
      ...stakeHolders.filter(
        (stateholder) => stateholder.project_stakeholder_id != id
      ),
    ]);
  };

  const addStakeholderField = () => {
    setStakeHolders([
      ...stakeHolders,
      {
        project_stakeholder_id: nanoid(),
        project_stakeholder_name: "",
        project_stakeholder_role: "",
        project_stakeholder_email: "",
      },
    ]);
  };

  useEffect(() => {
    setBudget(project.project_budget);
    setOutcomes(project.project_outcomes_and_metrics);
    setStakeHolders(project.project_stakeholders);
  }, [project]);

  const changeOutcomeMetric = (id: string, value: string, key: string) => {
    setOutcomes([
      ...outcomes.map((outcome) => {
        if (outcome.item_id == id) {
          return { ...outcome, [key]: value };
        } else return { ...outcome };
      }),
    ]);
  };

  const changeStakeholders = (id: string, value: string, key: string) => {
    setStakeHolders([
      ...stakeHolders.map((stakeHolder) => {
        if (stakeHolder.project_stakeholder_id == id) {
          return { ...stakeHolder, [key]: value };
        } else return { ...stakeHolder };
      }),
    ]);
  };

  const saveStakeholders: FormEventHandler = async (e) => {
    e.preventDefault();
    setUpdatingProject(true);

    const projectDocRef = await getProjectRef(projectId);

    const project_recommendations_stakeholder = stakeHolders.map(
      (stakeHolder) => {
        return {
          key: nanoid(),
          project_recommendations_stakeholder_id:
            stakeHolder.project_stakeholder_id,
          project_recommendations_competencies: "",
          project_recommendations_resources: "",
        };
      }
    );

    await updateDoc(projectDocRef, {
      project_budget: budget,
      project_outcomes_and_metrics: outcomes,
      project_stakeholders: stakeHolders,
      project_recommendations_stakeholder,
    });

    setProject({
      ...project,
      project_budget: budget,
      project_outcomes_and_metrics: outcomes,
      project_stakeholders: stakeHolders,
    });

    router.push(`/project/${projectId}/4`);
  };

  return (
    <Row>
      <Col span={4}>
        <Navbar />
      </Col>
      <Col span={20}>
        <Wrapper>
          <Spin spinning={updatingProject} tip="Saving stakeholders">
            <Typography.Title>{project.project_name}</Typography.Title>
            <form onSubmit={saveStakeholders}>
              <Space
                size="large"
                direction="vertical"
                style={{ display: "flex" }}
              >
                {/* 1st section */}
                <Space direction="vertical" style={{ display: "flex" }}>
                  <label htmlFor="budget">Budget</label>
                  <Input
                    name="budget"
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </Space>
                {/* 2nd section */}
                <Row gutter={20}>
                  <Col span={12}>
                    <label htmlFor="outcome">Outcome</label>
                  </Col>
                  <Col span={12}>
                    <label htmlFor="metric">Metric</label>
                  </Col>
                </Row>
                {outcomes.map((outcome, index) => (
                  <Row key={index} gutter={20}>
                    <Col span={12}>
                      <Input
                        value={outcome.project_outcome}
                        onChange={(e) =>
                          changeOutcomeMetric(
                            outcome.item_id,
                            e.target.value,
                            "project_outcome"
                          )
                        }
                        name="outcome"
                        id="outcome"
                      />
                    </Col>
                    <Col span={12}>
                      <div style={{ display: "flex", gap: 20 }}>
                        <Input
                          value={outcome.project_metric}
                          onChange={(e) =>
                            changeOutcomeMetric(
                              outcome.item_id,
                              e.target.value,
                              "project_metric"
                            )
                          }
                          style={{ width: "100%" }}
                          name="metric"
                          id="metric"
                        />
                        <Button
                          onClick={() => removeField(outcome.item_id)}
                          icon={<MinusCircleOutlined />}
                          danger
                        ></Button>
                      </div>
                    </Col>
                  </Row>
                ))}
                <Button
                  type="primary"
                  onClick={addField}
                  icon={<PlusCircleOutlined />}
                >
                  Add Field
                </Button>
                {/* 3rd section */}
                <Row gutter={20}>
                  <Col span={8}>
                    <label htmlFor="outcome">Stakeholders</label>
                  </Col>
                  <Col span={8}>
                    <label htmlFor="metric">Role</label>
                  </Col>
                  <Col span={8}>
                    <label htmlFor="metric">Email Address</label>
                  </Col>
                </Row>
                {stakeHolders.map((stakeHolder, index) => (
                  <Row key={index} gutter={20}>
                    <Col span={8}>
                      <Input
                        value={stakeHolder.project_stakeholder_name}
                        onChange={(e) =>
                          changeStakeholders(
                            stakeHolder.project_stakeholder_id,
                            e.target.value,
                            "project_stakeholder_name"
                          )
                        }
                        name="stakeholder-name"
                        id="stakeholder-name"
                      />
                    </Col>
                    <Col span={8}>
                      <Input
                        value={stakeHolder.project_stakeholder_role}
                        onChange={(e) =>
                          changeStakeholders(
                            stakeHolder.project_stakeholder_id,
                            e.target.value,
                            "project_stakeholder_role"
                          )
                        }
                        name="role"
                        id="role"
                      />
                    </Col>
                    <Col span={8}>
                      <div style={{ display: "flex", gap: 20 }}>
                        <Input
                          value={stakeHolder.project_stakeholder_email}
                          onChange={(e) =>
                            changeStakeholders(
                              stakeHolder.project_stakeholder_id,
                              e.target.value,
                              "project_stakeholder_email"
                            )
                          }
                          style={{ width: "100%" }}
                          type="email"
                          name="email"
                          id="email"
                        />
                        <Button
                          onClick={() =>
                            removeStakeholderField(
                              stakeHolder.project_stakeholder_id
                            )
                          }
                          icon={<MinusCircleOutlined />}
                          danger
                        ></Button>
                      </div>
                    </Col>
                  </Row>
                ))}
                <Button
                  type="primary"
                  onClick={addStakeholderField}
                  icon={<PlusCircleOutlined />}
                >
                  Add Stakeholder
                </Button>
              </Space>
              <ProjectFlowFooter previous={2} submitForm={saveStakeholders} />
            </form>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
