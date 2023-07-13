"use client";

import Wrapper from "@/app/components/Wrapper";
import { Button, Input, Space, Typography } from "antd";
import ProjectList from "./ProjectList";

const page = () => {
  return <Wrapper>
    <Typography.Title>Create a New Project</Typography.Title>
    <form>
        <Space direction="vertical" size="large" style={{ display:"flex", width:"50%"}}>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="project-name">Project Name</label>
                <Input name="project-name" id="project-name" />
            </Space>
            <Button type="primary" block>Create Project</Button>
        </Space>
    </form>
    <ProjectList/>
  </Wrapper>
}

export default page;