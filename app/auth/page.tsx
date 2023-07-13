"use client";
import { Button, Col, Row, Space, Typography } from 'antd'
import React from 'react'

const page = () => {
  return <main>
    <Row style={{minHeight:"100vh", alignItems:"center"}}>
      <Col span={12} offset={6}>
        <Typography.Title style={{textAlign: "center"}}>Welcome</Typography.Title>
        <Space style={{display:"flex"}} direction="vertical">
            <Button type="primary" href="/login" block>Log In</Button>
            <Button type="primary" href="/signup" block>Sign Up</Button>
        </Space>
      </Col>
    </Row>
  </main>
}

export default page