import { List, Typography } from 'antd'
import Link from 'next/link'
import React from 'react'

const projects = [
  {
    "name":"project 1",
    "link":"/project/project-1"
  },
  {
    "name":"project 2",
    "link":"/project/project-1"
  },
  {
    "name":"project 3",
    "link":"/project/project-1"
  },
  {
    "name":"project 4",
    "link":"/project/project-1"
  },
  {
    "name":"project 5",
    "link":"/project/project-1"
  },
]

const ProjectList = () => {
  return <div>
    <Typography.Title level={3}>My Projects</Typography.Title>
    <List
      header={<Typography.Text strong>PROJECT</Typography.Text>}
      dataSource={projects}
      renderItem={(project) => (
        <List.Item>
          <Link href={project.link}>
            <Typography.Text>{project.name}</Typography.Text>
          </Link>
        </List.Item>
      )}
      bordered
    />
  </div>
}

export default ProjectList