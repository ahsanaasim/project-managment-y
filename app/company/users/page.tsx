"use client";

import FullpageLoader from "@/app/components/FullpageLoader";
import NoSSR from "@/app/components/NoSSR";
import TopMenu from "@/app/components/TopMenu";
import Wrapper from "@/app/components/Wrapper";
import { useAppContext } from "@/app/context/AppProvider";
import { useCompanyContext } from "@/app/context/CompanyProvider";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Row, Space, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import SingleRow from "./SingleRow";
import useCompanyRef from "@/app/hooks/useCompanyRef";
import { updateDoc } from "firebase/firestore";

const Users = () => {
  const { user, loadingUser } = useAppContext();
  const router = useRouter();
  const { company, setCompany } = useCompanyContext();
  const [users, setUsers] = useState<User[]>(company.users);
  const [saving, setSaving] = useState(false);
  const getCompanyRef = useCompanyRef();

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

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        router.push("/auth");
      }
    }
  }, [loadingUser]);

  const saveUsers = async () => {
    setSaving(true);
    const companyRef = await getCompanyRef();
    await updateDoc(companyRef, {
      users,
    });

    setCompany &&
      setCompany({
        ...company,
        users,
      });

    setSaving(false);
    message.success("Users saved");
  };

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
            <SingleRow user={user} users={users} setUsers={setUsers} />
          ))}
          <Button onClick={addUserField} icon={<PlusCircleOutlined />}>
            Add User
          </Button>
          <Button loading={saving} type="primary" onClick={saveUsers}>
            Save Roles
          </Button>
        </Space>
      </Wrapper>
    </NoSSR>
  );
};

export default Users;
