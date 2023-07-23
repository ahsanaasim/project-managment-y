"use client";
import Wrapper from '@/app/components/Wrapper';
import { Button, Input, Space, Spin, Typography } from 'antd'
import { getDoc, updateDoc } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import React, { FormEventHandler, useEffect, useState } from 'react'
import useProjectRef from "@/app/hooks/useProjectRef"

const page = () => {
    const [overview, setOverview] = useState("")
    const [problem, setProblem] = useState("")
    const [purpose, setPurpose] = useState("")
    const [scope, setScope] = useState("")
    const [projectLink, setProjectLink] = useState("")
    const [projectName, setProjectName] = useState("")
    const [loadingProject, setLoadingProject] = useState(true);
    const [updatingProject, setUpdatingProject] = useState(false);
    const getProjectRef = useProjectRef()
    const path = usePathname();
    const projectId = path.split("/")[2]
    

    const createProjectDetails:FormEventHandler = async (e) => {
        e.preventDefault();
        setUpdatingProject(true);

        const projectDocRef = await getProjectRef(projectId);

        await updateDoc(projectDocRef, {
            project_overview: overview,
            project_problem: problem,
            project_purpose: purpose,
            project_scope: scope,
            project_link_to_plan: projectLink
        })

        setUpdatingProject(false)
    }

    useEffect(()=>{
        (async () => {
            const projectRef = await getProjectRef(projectId)
            const project = await getDoc(projectRef);
            const data = project.data();
            setOverview(data?.project_overview)
            setProblem(data?.project_problem)
            setPurpose(data?.project_purpose)
            setScope(data?.project_scope)
            setProjectLink(data?.project_link_to_plan)
            setProjectName(project.data()?.project_name)
            setLoadingProject(false);
        })()
    }, [])

  return <main>
    <Wrapper>
        <Spin spinning={loadingProject} tip="Loading project" style={{margin: "2rem auto", display: "block"}}>
            <Spin spinning={updatingProject} tip="Saving details">
                <Typography.Title>{projectName}</Typography.Title>
                <form onSubmit={createProjectDetails}>
                    <Space direction="vertical" size="large" style={{ display:"flex", width:"50%"}}>
                        <Space direction="vertical" style={{display:"flex"}}>
                            <label htmlFor="overview">Overview</label>
                            <Input.TextArea name="overview" id="overview" value={overview} onChange={e=>setOverview(e.target.value)} />
                        </Space>
                        <Space direction="vertical" style={{display:"flex"}}>
                            <label htmlFor="problem">Problem</label>
                            <Input.TextArea name="problem" id="problem" value={problem} onChange={e=>setProblem(e.target.value)} />
                        </Space>
                        <Space direction="vertical" style={{display:"flex"}}>
                            <label htmlFor="purpose">Purpose</label>
                            <Input.TextArea name="purpose" id="purpose" value={purpose} onChange={e=>setPurpose(e.target.value)} />
                        </Space>
                        <Space direction="vertical" style={{display:"flex"}}>
                            <label htmlFor="scope">Scope</label>
                            <Input.TextArea name="scope" id="scope" value={scope} onChange={e=>setScope(e.target.value)} />
                        </Space>
                        <Space direction="vertical" style={{display:"flex"}}>
                            <label htmlFor="project-link">Link to Project Plan</label>
                            <Input type="url" name="project-link" id="project-link" value={projectLink} onChange={e=>setProjectLink(e.target.value)} />
                        </Space>
                        <Button htmlType="submit" type="primary" block>Next</Button>
                    </Space>
                </form>
            </Spin>
        </Spin>
    </Wrapper>
  </main>
}

export default page