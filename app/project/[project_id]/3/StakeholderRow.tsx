import { CloseOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Col, Input, Row, Space, Tag } from "antd";
import React, { useState } from "react";

const StakeholderRow = ({
  stakeHolder,
  changeStakeholders,
  removeStakeholderField,
  stakeHolders,
  setStakeHolders,
  users,
  roles,
  roleOptions,
  userOptions,
}: {
  stakeHolder: ProjectStakeholder;
  changeStakeholders: (id: string, value: string, key: string) => void;
  removeStakeholderField: (id: string) => void;
  stakeHolders: ProjectStakeholder[];
  setStakeHolders: React.Dispatch<React.SetStateAction<ProjectStakeholder[]>>;
  users: User[];
  roles: Role[];
  roleOptions: {
    label: string;
    value: string;
  }[];
  userOptions: {
    label: string;
    value: string;
  }[];
}) => {
  const [currentRole, setCurrentRole] = useState("");

  const getUserName = (id: string) =>
    users.filter((user) => user.user_id == id)[0].user_name;

  const getRoleName = (id: string) => {
    const role = roles.filter((role) => role.role_id == id)[0];
    return role ? role.role_name : JSON.stringify(roles);
  };

  const setStakeholder = (newStakeholder: ProjectStakeholder) => {
    setStakeHolders([
      ...stakeHolders.map((tempStakeholder) => {
        if (
          tempStakeholder.project_stakeholder_id ==
          newStakeholder.project_stakeholder_id
        ) {
          return { ...newStakeholder };
        } else return { ...tempStakeholder };
      }),
    ]);
  };

  const removeRole = (roleId: string) => {
    setStakeHolders([
      ...stakeHolders.map((tempStakeHolder) => {
        if (
          tempStakeHolder.project_stakeholder_id ==
          stakeHolder.project_stakeholder_id
        ) {
          return {
            ...tempStakeHolder,
            stakeholder_role_id: [
              ...tempStakeHolder.stakeholder_role_id.filter(
                (id) => id !== roleId
              ),
            ],
          };
        } else return { ...tempStakeHolder };
      }),
    ]);
  };

  return (
    <Row gutter={20}>
      <Col span={8}>
        {/* <Input
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
        /> */}

        <AutoComplete
          filterOption={(inputValue, option) => {
            if (option) {
              if (option.label.includes(inputValue)) return true;
              else return false;
            } else return false;
          }}
          value={stakeHolder.project_stakeholder_name}
          style={{ width: 200 }}
          options={userOptions}
          onSelect={(value) => {
            const userName = getUserName(value);
            setStakeholder({
              ...stakeHolder,
              project_stakeholder_name: userName,
            });
          }}
          onChange={(value) => {
            setStakeholder({ ...stakeHolder, project_stakeholder_name: value });
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
          {stakeHolder.stakeholder_role_id.map((id, index) => {
            return (
              <Tag key={index}>
                <Space size="small">
                  {getRoleName(id)}
                  <CloseOutlined
                    style={{ cursor: "pointer" }}
                    onClick={() => removeRole(id)}
                  />
                </Space>
              </Tag>
            );
          })}
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
              if (!stakeHolder.stakeholder_role_id.includes(value)) {
                setStakeholder({
                  ...stakeHolder,
                  stakeholder_role_id: [
                    ...stakeHolder.stakeholder_role_id,
                    value,
                  ],
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
              removeStakeholderField(stakeHolder.project_stakeholder_id)
            }
            icon={<MinusCircleOutlined />}
            danger
          ></Button>
        </div>
      </Col>
    </Row>
  );
};

export default StakeholderRow;
