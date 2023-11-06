import { useCompanyContext } from "@/app/context/CompanyProvider";
import { CloseOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Col, Input, Row, Space, Tag } from "antd";
import React, { FC, useState } from "react";

type Props = {
  user: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const SingleRow: FC<Props> = ({ user, users, setUsers }) => {
  const { company } = useCompanyContext();
  const [currentSelectedUserName, setCurrentSelectedUserName] = useState(
    user.user_name
  );
  const [currentRole, setCurrentRole] = useState("");
  const roles = company.roles;
  const roleOptions = company.roles.map((role) => ({
    label: role.role_name,
    value: role.role_id,
  }));
  const userOptions = company.users.map((user) => ({
    label: user.user_name,
    value: user.user_id,
  }));

  const removeUserField = (id: string) => {
    setUsers([...users.filter((user) => user.user_id != id)]);
  };

  const getRoleName = (id: string) =>
    roles.filter((role) => role.role_id == id)[0].role_name;

  const onChange = (userId: string, fieldName: keyof User, value: string) => {
    setUsers([
      ...users.map((user) => {
        if (userId == user.user_id) {
          if (fieldName == "role_id" && !user.role_id.includes(value)) {
            return {
              ...user,
              role_id: [...user.role_id, value],
            };
          } else if (fieldName == "user_name")
            return { ...user, user_name: getUserName(value) };

          return { ...user, user_email: value };
        } else return user;
      }),
    ]);
  };

  // const searchRoles = (text: string) => {
  //   const filteredRoles = roles.filter((role) => role.role_name.includes(text));

  //   setRoleOptions(
  //     filteredRoles.map((role) => ({
  //       label: role.role_name,
  //       value: role.role_id,
  //     }))
  //   );
  // };

  const getUserName = (id: string) =>
    users.filter((user) => user.user_id == id)[0].user_name;

  // const searchUser = (
  //   userId: string,
  //   fieldName: keyof User,
  //   searchText: string
  // ) => {
  //   // onChange(userId, fieldName, searchText);
  //   // console.log(userOptions);

  //   const filteredUsers = users.filter((user) =>
  //     user.user_name.includes(searchText)
  //   );

  //   setUserOptions(
  //     filteredUsers.map((user) => ({
  //       label: user.user_id,
  //       value: user.user_name,
  //     }))
  //   );
  // };

  const setUser = (newUser: User) => {
    setUsers([
      ...users.map((tempUser) => {
        if (tempUser.user_id == user.user_id) {
          return { ...newUser };
        } else return { ...tempUser };
      }),
    ]);
  };

  const removeRole = (roleId: string) => {
    console.log(user.role_id);
    console.log(roleId);

    setUser({
      ...user,
      role_id: [
        ...user.role_id.filter((id) => {
          console.log(id, roleId);

          return id !== roleId;
        }),
      ],
    });
  };

  return (
    <Row gutter={20}>
      <Col span={8}>
        <AutoComplete
          filterOption={(inputValue, option) => {
            if (option) {
              if (option.label.includes(inputValue)) return true;
              else return false;
            } else return false;
          }}
          value={currentSelectedUserName}
          style={{ width: 200 }}
          options={userOptions}
          onSelect={(value) => {
            const userName = getUserName(value);
            setCurrentSelectedUserName(userName);
            setUser({ ...user, user_name: userName });
          }}
          onChange={(value) => {
            setCurrentSelectedUserName(value);
            setUser({ ...user, user_name: value });
          }}
          placeholder="Name"
        />
      </Col>
      <Col span={8}>
        <Space
          size="small"
          style={{
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            flexWrap: "wrap",
            padding: "5px",
          }}
        >
          {user.role_id.map((id, index) => (
            <Tag key={index}>
              <Space size="small">
                {getRoleName(id)}
                <CloseOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => removeRole(id)}
                />
              </Space>
            </Tag>
          ))}
          <AutoComplete
            value={currentRole}
            style={{ width: 200 }}
            options={roleOptions}
            filterOption={(inputValue, option) => {
              if (option) {
                if (option.label.includes(inputValue)) return true;
                else return false;
              } else return false;
            }}
            onSelect={(value) => {
              if (!user.role_id.includes(value)) {
                setUser({
                  ...user,
                  role_id: [...user.role_id, value],
                });
              }
              setCurrentRole("");
            }}
            onChange={(value) => {
              setCurrentRole(value);
            }}
            placeholder="Role"
          />
        </Space>
      </Col>
      <Col span={8}>
        <div style={{ display: "flex", gap: 20 }}>
          <Input
            value={user.user_email}
            onChange={(e) =>
              onChange(user.user_id, "user_email", e.target.value)
            }
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
  );
};

export default SingleRow;
