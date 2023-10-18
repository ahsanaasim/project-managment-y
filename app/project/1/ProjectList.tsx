import { List, Typography } from "antd";
import { DocumentData } from "firebase/firestore";
import Link from "next/link";
import React from "react";

const ProjectList = ({
  projects,
  fetchingProjects,
}: {
  projects: DocumentData[];
  fetchingProjects: boolean;
}) => {
  console.log(projects);

  return (
    <div>
      <Typography.Title level={3}>My Projects</Typography.Title>
      <List
        loading={fetchingProjects}
        header={<Typography.Text strong>PROJECT</Typography.Text>}
        dataSource={projects}
        renderItem={(project) => (
          <List.Item style={{ padding: "0" }}>
            <Link
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
              }}
              href={`/project/${project.project_id}/2`}
            >
              <Typography.Text>{project.project_name}</Typography.Text>
            </Link>
          </List.Item>
        )}
        bordered
      />
    </div>
  );
};

export default ProjectList;
