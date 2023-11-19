"use client";
import Wrapper from "@/app/components/Wrapper";
import _ from "lodash";
import {
  AutoComplete,
  Button,
  Col,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import React, { FormEventHandler, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useProjectContext } from "@/app/context/ProjectProvider";
import useProjectRef from "@/app/hooks/useProjectRef";
import { useRouter } from "next/navigation";
import useProjectId from "@/app/hooks/useProjectId";
import { updateDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";
import ScrollInput from "@/app/components/ScrollInput";
import Footer from "@/app/components/Footer";
import useProject from "@/app/hooks/useProject";
import useNextConfirmation from "@/app/hooks/useNextConfirmation";
import { useAppContext } from "@/app/context/AppProvider";
import StakeholderRow from "./StakeholderRow";
import useGetCompany from "@/app/hooks/useGetCompany";
import FullpageLoader from "@/app/components/FullpageLoader";

const Page = () => {
  const { project, setProject } = useProjectContext();
  const getCompany = useGetCompany();
  const { user } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleOptions, setRoleOptions] = useState(
    roles.map((role) => ({
      label: role.role_name,
      value: role.role_id,
    }))
  );
  const [userOptions, setUserOptions] = useState(
    users.map((user) => ({
      label: user.user_name,
      value: user.user_id,
    }))
  );
  const [budget, setBudget] = useState("");
  const [outcomes, setOutcomes] = useState<ProjectOutcomesAndMetric[]>(
    project.project_outcomes_and_metrics
  );
  const [stakeHolders, setStakeHolders] = useState<ProjectStakeholder[]>(
    project.project_stakeholders
  );
  const [updatingProject, setUpdatingProject] = useState(false);
  const getProjectRef = useProjectRef();
  const getProject = useProject();
  const projectId = useProjectId();
  const router = useRouter();
  const showConfirm = useNextConfirmation();

  const removeField = (id: string) => {
    setOutcomes([
      ...outcomes.filter(
        (outcome) => outcome.project_outcomes_and_metrics_id != id
      ),
    ]);
  };

  const addField = () => {
    setOutcomes([
      ...outcomes,
      {
        project_outcome: "",
        project_metric: "",
        project_outcomes_and_metrics_id: nanoid(),
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
        user_id: "",
        stakeholder_role_id: [],
        project_stakeholder_email: "",
        project_stakeholder_name: "",
        project_recommendations_stakeholder: [],
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
        if (outcome.project_outcomes_and_metrics_id == id) {
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
    if (!user) return;
    e.preventDefault();
    setUpdatingProject(true);

    // removing empty stakeholder fields
    const finalStakeholders = [
      ...stakeHolders.filter(
        (stakeHolder) => stakeHolder.project_stakeholder_name
      ),
    ];
    setStakeHolders([...finalStakeholders]);

    const projectDocRef = await getProjectRef(projectId, user);

    const project_recommendations_stakeholder = finalStakeholders.map(
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
      project_stakeholders: finalStakeholders,
      // project_recommendations_stakeholder,
    });

    setProject({
      ...project,
      project_budget: budget,
      project_outcomes_and_metrics: outcomes,
      project_stakeholders: finalStakeholders,
      // project_recommendations_stakeholder,
    });

    // router.push(`/project/${projectId}/4`);
    setUpdatingProject(false);
    message.success("Saved");
  };

  const saveConfirmation = async (isNext: boolean) => {
    if (!user) return;
    const goingTo = isNext ? 4 : 2;
    const projectInDB = await getProject(user, projectId);
    const {
      project_budget,
      project_outcomes_and_metrics,
      project_stakeholders,
    } = projectInDB as Project;

    if (
      project_budget !== budget ||
      !_.isEqual(project_outcomes_and_metrics, outcomes) ||
      !_.isEqual(project_stakeholders, stakeHolders)
    ) {
      showConfirm(projectId, goingTo);
      console.log(JSON.stringify(project_stakeholders[0]));
      console.log(JSON.stringify(stakeHolders[0]));
    } else router.push(`/project/${projectId}/${goingTo}`);
  };

  useEffect(() => {
    (async () => {
      if (!user) return;
      const company = await getCompany(user);
      if (!company) return;
      setUsers(company.users);
      setUserOptions(
        company.users.map((user) => ({
          label: user.user_name,
          value: user.user_id,
        }))
      );

      setRoles(company.roles);
      setRoleOptions(
        company.roles.map((role) => ({
          label: role.role_name,
          value: role.role_id,
        }))
      );
    })();
  }, []);

  if (!user || !users.length || !roles.length) return <FullpageLoader />;

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
                {outcomes.length !== 0 && (
                  <>
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
                          <ScrollInput
                            value={outcome.project_outcome}
                            onChange={(e) =>
                              changeOutcomeMetric(
                                outcome.project_outcomes_and_metrics_id,
                                e.target.value,
                                "project_outcome"
                              )
                            }
                            name="outcome"
                          />
                        </Col>
                        <Col span={12}>
                          <div style={{ display: "flex", gap: 20 }}>
                            <ScrollInput
                              value={outcome.project_metric}
                              onChange={(e) =>
                                changeOutcomeMetric(
                                  outcome.project_outcomes_and_metrics_id,
                                  e.target.value,
                                  "project_metric"
                                )
                              }
                              // style={{ width: "100%" }}
                              name="metric"
                            />
                            <Button
                              onClick={() =>
                                removeField(
                                  outcome.project_outcomes_and_metrics_id
                                )
                              }
                              icon={<MinusCircleOutlined />}
                              danger
                            ></Button>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
                <Button
                  type="primary"
                  onClick={addField}
                  icon={<PlusCircleOutlined />}
                >
                  Add New Outcome and Metric
                </Button>
                {/* 3rd section */}
                {stakeHolders.length !== 0 && (
                  <>
                    <Row gutter={20}>
                      <Col span={8}>
                        <label htmlFor="outcome">Stakeholder Name</label>
                      </Col>
                      <Col span={8}>
                        <label htmlFor="metric">Role</label>
                      </Col>
                      <Col span={8}>
                        <label htmlFor="metric">Email Address</label>
                      </Col>
                    </Row>
                    {stakeHolders.map((stakeHolder, index) => (
                      <StakeholderRow
                        key={index}
                        stakeHolder={stakeHolder}
                        changeStakeholders={changeStakeholders}
                        removeStakeholderField={removeStakeholderField}
                        stakeHolders={stakeHolders}
                        setStakeHolders={setStakeHolders}
                        roleOptions={roleOptions}
                        userOptions={userOptions}
                        users={users}
                        roles={roles}
                      />
                    ))}
                  </>
                )}
                <Button
                  type="primary"
                  onClick={addStakeholderField}
                  icon={<PlusCircleOutlined />}
                >
                  Add New Stakeholder
                </Button>
                <Footer
                  saveHandler={saveStakeholders}
                  confirmationHandlerPrevious={() => saveConfirmation(false)}
                  confirmationHandlerNext={() => saveConfirmation(true)}
                />
              </Space>
              {/* <ProjectFlowFooter previous={2} submitForm={saveStakeholders} /> */}
            </form>
          </Spin>
        </Wrapper>
      </Col>
    </Row>
  );
};

export default Page;
