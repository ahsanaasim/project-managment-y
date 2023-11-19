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
import { nanoid } from "nanoid";

const Users = () => {
  const { user, loadingUser } = useAppContext();
  const router = useRouter();
  const { company, setCompany } = useCompanyContext();
  const [users, setUsers] = useState<User[]>(company.users);
  const [adminUser, setAdminUser] = useState<User>();
  const [saving, setSaving] = useState(false);
  const getCompanyRef = useCompanyRef();

  const addUserField = () => {
    setUsers([
      ...users,
      {
        user_id: nanoid(),
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

    setUsers(
      users.filter((tempUser) => {
        if (tempUser.user_email == user?.email) {
          setAdminUser(tempUser);
          return false;
        }

        return true;
      })
    );
  }, [loadingUser]);

  const saveUsers = async () => {
    if (user) {
      setSaving(true);

      // remove empty fields
      const finalUsers = [
        ...users.filter((user) => user.user_name && user.user_email),
      ];
      setUsers([...finalUsers]);

      // check if email available
      // in original users list in db
      for (let i = 0; i < company.users.length; i++) {
        for (let j = 0; j < finalUsers.length; j++) {
          if (company.users[i].user_id !== finalUsers[j].user_id) {
            if (company.users[i].user_email == finalUsers[j].user_email) {
              setSaving(false);
              return message.error(
                `Email address ${finalUsers[j].user_email} is already in use`
              );
            }
          }
        }
      }

      // in current list
      for (let i = 0; i < finalUsers.length; i++) {
        for (let j = 0; j < finalUsers.length; j++) {
          if (finalUsers[i].user_id !== finalUsers[j].user_id) {
            if (finalUsers[i].user_email == finalUsers[j].user_email) {
              setSaving(false);
              return message.error(
                `Email address ${finalUsers[j].user_email} is already in use`
              );
            }
          }
        }
      }

      const companyRef = await getCompanyRef(user);
      await updateDoc(companyRef, {
        users: [...finalUsers, { ...adminUser }],
      });

      setCompany &&
        setCompany({
          ...company,
          users: [...finalUsers, { ...adminUser }],
        });

      setSaving(false);
      message.success("Users saved");
    }
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
            <SingleRow
              key={index}
              user={user}
              users={users}
              setUsers={setUsers}
              adminUser={adminUser}
            />
          ))}
          <Button onClick={addUserField} icon={<PlusCircleOutlined />}>
            Add User
          </Button>
          <Button loading={saving} type="primary" onClick={saveUsers}>
            Save Users
          </Button>
        </Space>
      </Wrapper>
    </NoSSR>
  );
};

export default Users;
