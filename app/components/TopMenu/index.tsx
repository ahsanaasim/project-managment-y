"use client";
import { auth } from "@/app/firebase";
import {
  Button,
  Divider,
  Dropdown,
  MenuProps,
  Modal,
  Space,
  Typography,
} from "antd";
import { signOut } from "firebase/auth";
import React, { FormEventHandler } from "react";
import Wrapper from "../Wrapper";
import { useAppContext } from "@/app/context/AppProvider";
import { usePathname, useRouter } from "next/navigation";
import { ExclamationCircleFilled, SettingFilled } from "@ant-design/icons";
import Link from "next/link";

const TopMenu = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const path = usePathname();
  console.log(path);

  const logout: FormEventHandler = async () => {
    await signOut(auth);

    router.push("/auth");
  };

  const { confirm } = Modal;

  const confirmSignout = () => {
    confirm({
      title: "Are you sure want to sign out?",
      okText: "Sign Out",
      icon: <ExclamationCircleFilled />,
      // onOk() {
      //   console.log("OK");
      // },
      // onCancel() {
      //   console.log("Cancel");
      // },
      onOk: logout,
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link href="http://localhost:3000/project/1">Projects</Link>,
    },
    {
      key: "2",
      label: <Link href="http://localhost:3000/project/users">Users</Link>,
    },
    {
      key: "3",
      label: <Link href="http://localhost:3000/project/roles">Roles</Link>,
    },
  ];

  // const confirmSignout = () => {};

  return (
    <header>
      <Wrapper>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "1rem 0",
          }}
        >
          <Typography.Title style={{ margin: 0 }} level={3}>
            Project Management
          </Typography.Title>
          {!["/auth", "/auth/login", "/auth/signup"].includes(path) && (
            <div>
              <Dropdown
                menu={{
                  items: [
                    ...items,
                    !user
                      ? {
                          key: "4",
                          label: <Link href="/auth/login">Login</Link>,
                        }
                      : {
                          key: "4",
                          label: (
                            <Link onClick={confirmSignout} href="#">
                              Sign Out
                            </Link>
                          ),
                        },
                  ],
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <SettingFilled
                      style={{
                        fontSize: "1.5rem",
                        marginLeft: "1rem",
                        cursor: "pointer",
                      }}
                    />
                  </Space>
                </a>
              </Dropdown>
            </div>
          )}
        </div>
      </Wrapper>
      <Divider />
    </header>
  );
};

export default TopMenu;
