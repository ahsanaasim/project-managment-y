"use client";

import NoSSR from "@/app/components/NoSSR";
import TopMenu from "@/app/components/TopMenu";
import Wrapper from "@/app/components/Wrapper";
import { useAppContext } from "@/app/context/AppProvider";
import { useCompanyContext } from "@/app/context/CompanyProvider";
import useCompanyRef from "@/app/hooks/useCompanyRef";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Space, Typography, message } from "antd";
import { updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Users = () => {
  const { user, loadingUser } = useAppContext();
  const { company, setCompany } = useCompanyContext();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>(company.roles);
  const getCompanyRef = useCompanyRef();
  const [saving, setSaving] = useState(false);

  const addRoleField = () => {
    setRoles([
      ...roles,
      {
        role_id: nanoid(),
        role_name: "",
      },
    ]);
  };

  const removeUserField = (id: string) => {
    setRoles([...roles.filter((role) => role.role_id != id)]);
  };

  const roleInput = (id: string, value: string) => {
    setRoles(
      roles.map((role) => {
        if (role.role_id == id) {
          return { ...role, role_name: value };
        } else return role;
      })
    );
  };

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        router.push("/auth");
      }
    }
  }, [loadingUser]);

  const saveRoles = async () => {
    if (user) {
      setSaving(true);
      const companyRef = await getCompanyRef(user);
      await updateDoc(companyRef, {
        roles,
      });

      setCompany &&
        setCompany({
          ...company,
          roles,
        });

      setSaving(false);
      message.success("Roles saved");
    }
  };

  console.log("loading = ", loadingUser, "user = ", user);

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
                  onChange={(e) => roleInput(role.role_id, e.target.value)}
                />
              </Col>
              <Col span={8}>
                <div style={{ display: "flex", gap: 20 }}>
                  <Button
                    onClick={() => removeUserField(role.role_id)}
                    icon={<MinusCircleOutlined />}
                    danger
                  ></Button>
                </div>
              </Col>
            </Row>
          ))}
          <Button onClick={addRoleField} icon={<PlusCircleOutlined />}>
            Add New Role
          </Button>
          <Button loading={saving} type="primary" onClick={saveRoles}>
            Save Roles
          </Button>
        </Space>
      </Wrapper>
    </NoSSR>
  );
};

export default Users;
