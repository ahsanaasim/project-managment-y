"use client";

import Wrapper from "@/app/components/Wrapper";
import { Button, Input, Space, Typography } from "antd";
import ProjectList from "./ProjectList";
import { FormEventHandler, useState } from "react";

const Page = () => {
  const [name, setName] = useState("");

  const createProject:FormEventHandler = (e) => {
    e.preventDefault();

    // save in firestore
    
  }

  return <Wrapper>
    <Typography.Title>Create a New Project</Typography.Title>
    <form onSubmit={createProject}>
        <Space direction="vertical" size="large" style={{ display:"flex", width:"50%"}}>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="project-name">Project Name</label>
                <Input value={name} onChange={e=>setName(e.target.value)} name="project-name" id="project-name" />
            </Space>
            <Button htmlType="submit" type="primary" block>Create Project</Button>
        </Space>
    </form>
    <ProjectList/>
  </Wrapper>
}

export default Page;