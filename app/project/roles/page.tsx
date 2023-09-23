"use client";

import FullpageLoader from "@/app/components/FullpageLoader";
import NoSSR from "@/app/components/NoSSR";
import TopMenu from "@/app/components/TopMenu";
import Wrapper from "@/app/components/Wrapper";
import { useAppContext } from "@/app/context/AppProvider";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Users = () => {
  const { user, loadingUser } = useAppContext();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([
    {
      role_id: "role1",
      role_name: "role 1",
    },
    {
      role_id: "role2",
      role_name: "role 2",
    },
    {
      role_id: "role3",
      role_name: "role 3",
    },
  ]);

  const addRoleField = () => {
    setRoles([
      ...roles,
      {
        role_id: "",
        role_name: "",
      },
    ]);
  };

  const removeUserField = (id: string) => {
    setRoles([...roles.filter((role) => role.role_id != id)]);
  };

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        router.push("/auth");
      }
    }
  }, [loadingUser]);

  if (loadingUser || !user) return <FullpageLoader />;

  return (
    <NoSSR>
      <TopMenu />
      <Wrapper>
        <Typography.Title>Add New Roles</Typography.Title>
        <Space direction="vertical" style={{ display: "flex" }} size="large">
          <Row gutter={20}>
            <Col span={8}>
              <label htmlFor="metric">
                <Typography.Text strong>Role</Typography.Text>
              </label>
            </Col>
          </Row>
          {roles.map((role, index) => (
            <Row key={index} gutter={20}>
              <Col span={8}>
                <Input
                  value={role.role_name}
                  // onChange={(e) =>
                  //   changeStakeholders(
                  //     stakeHolder.project_stakeholder_id,
                  //     e.target.value,
                  //     "project_stakeholder_name"
                  //   )
                  // }
                  // name="stakeholder-name"
                  // id="stakeholder-name"
                />
              </Col>
              <Col span={8}>
                <div style={{ display: "flex", gap: 20 }}>
                  {/* <Input
                    value={user.user_email}
                    //   onChange={(e) =>
                    //     changeStakeholders(
                    //       stakeHolder.project_stakeholder_id,
                    //       e.target.value,
                    //       "project_stakeholder_email"
                    //     )
                    //   }
                    style={{ width: "100%" }}
                    type="email"
                    name="email"
                    id="email"
                  /> */}
                  <Button
                    onClick={() => removeUserField(role.role_id)}
                    icon={<MinusCircleOutlined />}
                    danger
                  ></Button>
                </div>
              </Col>
            </Row>
          ))}
          <Button
            type="primary"
            onClick={addRoleField}
            icon={<PlusCircleOutlined />}
          >
            Add User
          </Button>
        </Space>
      </Wrapper>
    </NoSSR>
  );
};

export default Users;
