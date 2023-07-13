"use client";
import Wrapper from '@/app/components/Wrapper';
import { Button, Input, Space, Typography } from 'antd'
import React from 'react'

const page = () => {
  return <main>
    <Wrapper>
    <Typography.Title>Project 1</Typography.Title>
    <form>
        <Space direction="vertical" size="large" style={{ display:"flex", width:"50%"}}>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="overview">Overview</label>
                <Input.TextArea name="overview" id="overview" />
            </Space>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="problem">Problem</label>
                <Input.TextArea name="problem" id="problem" />
            </Space>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="purpose">Purpose</label>
                <Input.TextArea name="purpose" id="purpose" />
            </Space>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="scope">Scope</label>
                <Input.TextArea name="scope" id="scope" />
            </Space>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="project-link">Link to Project Plan</label>
                <Input type="url" name="project-link" id="project-link" />
            </Space>
            <Button href="/project/3" type="primary" block>Next</Button>
        </Space>
    </form>
    </Wrapper>
  </main>
}

export default page