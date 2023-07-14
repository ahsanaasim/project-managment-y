"use client";
import React from 'react';
import { GoogleOutlined} from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Typography } from 'antd';

const App: React.FC = () => {

  return (
    <main>
        <Row style={{minHeight:"100vh", alignItems:"center"}}>
        <Col span={12} offset={6}>
            <Typography.Title style={{textAlign: "center"}}>Sign Up</Typography.Title>
                <form>
                    <Space direction="vertical" size="large" style={{ display:"flex"}}>
                        <Space direction="vertical" style={{ display:"flex"}}>
                            <label htmlFor="email">Email</label>
                            <Input />
                        </Space>
                        <Space direction="vertical" style={{ display:"flex"}}>
                            <label htmlFor="password">Password</label>
                            <Input type="password" />
                        </Space>
                        <Button type="primary" block>Sign Up</Button>
                        <Typography style={{textAlign:"center"}}>or</Typography>
                        <Button style={{borderRadius:"50px", margin: "0 auto", display:"block"}} type="primary" icon={<GoogleOutlined />}>Continue with Google</Button>
                    </Space>
                </form>
                <Button type="primary" style={{margin:"2rem auto 0 auto"}} href="/auth" block>Back</Button>
        </Col>
        </Row>
    </main>
  );
};

export default App;