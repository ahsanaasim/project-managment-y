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
  const [users, setUsers] = useState<User[]>([
    {
      user_id: "user 1 id",
      user_name: "user 1",
      user_email: "user1@gmail.com",
      role_id: ["r1", "r2"],
      user_permissions: "user permission",
    },
    {
      user_id: "user 2 id",
      user_name: "user 1",
      user_email: "user1@gmail.com",
      role_id: ["r1", "r2"],
      user_permissions: "user permission",
    },
    {
      user_id: "user 3 id",
      user_name: "user 1",
      user_email: "user1@gmail.com",
      role_id: ["r1", "r2"],
      user_permissions: "user permission",
    },
  ]);

  const addUserField = () => {
    setUsers([
      ...users,
      {
        user_id: "",
        user_name: "",
        user_email: "",
        role_id: [],
        user_permissions: "",
      },
    ]);
  };

  const removeUserField = (id: string) => {
    setUsers([...users.filter((user) => user.user_id != id)]);
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
        <Typography.Title>Add New Users</Typography.Title>
        <Space direction="vertical" style={{ display: "flex" }} size="large">
          <Row gutter={20}>
            <Col span={8}>
              <label htmlFor="outcome">
                <Typography.Text strong>User</Typography.Text>
              </label>
            </Col>
            <Col span={8}>
              <label htmlFor="metric">
                <Typography.Text strong>Role</Typography.Text>
              </label>
            </Col>
            <Col span={8}>
              <label htmlFor="metric">
                <Typography.Text strong>Email Address</Typography.Text>
              </label>
            </Col>
          </Row>
          {users.map((user, index) => (
            <Row key={index} gutter={20}>
              <Col span={8}>
                <Input
                  value={user.user_name}
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
                <Input
                  value={user.user_permissions}
                  // onChange={(e) =>
                  //   changeStakeholders(
                  //     stakeHolder.project_stakeholder_id,
                  //     e.target.value,
                  //     "project_stakeholder_role"
                  //   )
                  // }
                  // name="role"
                  // id="role"
                />
              </Col>
              <Col span={8}>
                <div style={{ display: "flex", gap: 20 }}>
                  <Input
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
                  />
                  <Button
                    onClick={() => removeUserField(user.user_id)}
                    icon={<MinusCircleOutlined />}
                    danger
                  ></Button>
                </div>
              </Col>
            </Row>
          ))}
          <Button
            type="primary"
            onClick={addUserField}
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
