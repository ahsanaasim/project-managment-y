"use client";
import Wrapper from '@/app/components/Wrapper'
import { Button, Col, Input, Row, Space, Typography } from 'antd'
import React, { useState } from 'react'
import { nanoid } from 'nanoid';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ProjectFlowFooter from '../ProjectFlowFooter';

const Page = () => {
const [outcomes, setOutcomes] = useState([
    {
        "outcome" : "",
        "metric" : "",
        "id" : nanoid()
    },
    {
        "outcome" : "",
        "metric" : "",
        "id" : nanoid()
    },
])
const [stakeHolders, setStakeHolders] = useState([
    {
        id: nanoid(),
        name: "",
        roles: "",
        email: ""
    },
    {
        id: nanoid(),
        name: "",
        roles: "",
        email: ""
    }
])
    const removeField = (id: string) => {
        setOutcomes([...outcomes.filter(outcome => outcome.id != id)])
    }

    const addField = () => {
        setOutcomes([...outcomes, {
            "outcome" : "",
            "metric" : "",
            "id" : nanoid()
        }])
    }

    const removeStakeholderField = (id: string) => {
        setStakeHolders([...stakeHolders.filter(stateholder => stateholder.id != id)])
    }

    const addStakeholderField = () => {
        setStakeHolders([...stakeHolders, {
            id: nanoid(),
            name: "",
            roles: "",
            email: ""
        }])
    }

  return <Wrapper>
    <Typography.Title>Project 1</Typography.Title>
    <form>
        <Space size="large" direction='vertical' style={{display:"flex"}}>
            {/* 1st section */}
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="budget">Budget</label>
                <Input type="url" name="budget" id="budget" />
            </Space>
            {/* 2nd section */}
            <Row gutter={20}>
                <Col span={12}>
                    <label htmlFor="outcome">Outcome</label>
                </Col>
                <Col span={12}>
                    <label htmlFor="metric">Metric</label>
                </Col>
            </Row>
            {outcomes.map((outcome, index) => <Row key={index} gutter={20}>
                <Col span={12}>
                    <Input name="outcome" id="outcome" />
                </Col>
                <Col span={12}>
                    <div style={{display:"flex", gap: 20}}>
                        <Input style={{width:"100%"}} name="metric" id="metric" />
                        <Button onClick={()=>removeField(outcome.id)} icon={<MinusCircleOutlined />} danger></Button>
                    </div>
                </Col>
            </Row> )}
            <Button type="primary" onClick={addField} icon={<PlusCircleOutlined />}>Add Field</Button>
            {/* 3rd section */}
            <Row gutter={20}>
                <Col span={8}>
                    <label htmlFor="outcome">Stakeholders</label>
                </Col>
                <Col span={8}>
                    <label htmlFor="metric">Role</label>
                </Col>
                <Col span={8}>
                    <label htmlFor="metric">Email Address</label>
                </Col>
            </Row>
            {stakeHolders.map((stakeHolder, index) => <Row  key={index} gutter={20}>
                <Col span={8}>
                    <Input name="stakeholder-name" id="stakeholder-name" />
                </Col>
                <Col span={8}>
                    <Input name="role" id="role" />
                </Col>
                <Col span={8}>
                    <div style={{display:"flex", gap: 20}}>
                        <Input style={{width:"100%"}} type='email' name="email" id="email" />
                        <Button onClick={()=>removeStakeholderField(stakeHolder.id)} icon={<MinusCircleOutlined />} danger></Button>
                    </div>
                </Col>
            </Row> )}
            <Button type="primary" onClick={addStakeholderField} icon={<PlusCircleOutlined />}>Add Field</Button>
        </Space>
    </form>
    <ProjectFlowFooter previous={2} next={4} />
  </Wrapper>
}

export default Page