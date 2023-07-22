import { List, Typography } from 'antd'
import { DocumentData } from 'firebase/firestore'
import Link from 'next/link'
import React from 'react'

// const projects = [
//   {
//     "name":"project 1",
//     "link":"/project/project-1"
//   },
//   {
//     "name":"project 2",
//     "link":"/project/project-1"
//   },
//   {
//     "name":"project 3",
//     "link":"/project/project-1"
//   },
//   {
//     "name":"project 4",
//     "link":"/project/project-1"
//   },
//   {
//     "name":"project 5",
//     "link":"/project/project-1"
//   },
// ]

const ProjectList = ({projects, fetchingProjects}:{projects: DocumentData[], fetchingProjects: boolean}) => {
  return <div>
    <Typography.Title level={3}>My Projects</Typography.Title>
    <List
      loading={fetchingProjects}
      header={<Typography.Text strong>PROJECT</Typography.Text>}
      dataSource={projects}
      renderItem={(project) => (
        <List.Item>
          <Link href={`/project/${project.project_id}/2`}>
            <Typography.Text>{project.project_name}</Typography.Text>
          </Link>
        </List.Item>
      )}
      bordered
    />
  </div>
}

export default ProjectList