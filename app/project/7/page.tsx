"use client";
import Wrapper from '@/app/components/Wrapper'
import { Button, Input, Space, Table, Typography } from 'antd'
import { nanoid } from 'nanoid';
import React, { useState } from 'react'

const Page = () => {
    const [tableData, setTableData] = useState([
        {
            key: nanoid(),
            stakeholder: "name 1",
            competencies: "",
            resources: ""
        },
        {
            key: nanoid(),
            stakeholder: "name 1",
            competencies: "",
            resources: ""
        },
        {
            key: nanoid(),
            stakeholder: "name 1",
            competencies: "",
            resources: ""
        },
    ])
  return <Wrapper>
    <Typography.Title>Recommendations</Typography.Title>
    <form>
        <Space direction='vertical' style={{display:"flex"}}>
            <label>General Recommendations</label>
            <Input.TextArea></Input.TextArea>
        </Space>
    </form>
    <br />
    <Typography.Text>Stakeholder Recommendations</Typography.Text>
    <Table dataSource={tableData} pagination={false}>
        <Table.Column title="Stakeholder" dataIndex="stakeholder" key="stakeholder" />
        <Table.Column title="Competencies" dataIndex="competencies" key="competencies" render={()=><Input />} />
        <Table.Column title="Resources" dataIndex="resources" key="resources" render={()=><Input />} />
        <Table.Column render={()=><Button type="link">Send</Button>} />
    </Table>
    <Space style={{margin:"2rem 0", display: "flex", justifyContent: "center"}}>
        <Button style={{width: "200px"}} href="/project/6" type="primary">Back</Button>
        <Button style={{width: "200px"}} type="primary">Edit</Button>
        <Button style={{width: "200px"}} href="/project/1" type="primary">Next</Button>
    </Space>
  </Wrapper>
}

export default Page