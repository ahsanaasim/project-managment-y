"use client";
import React, { FormEventHandler, useState } from 'react';
import { GoogleOutlined} from '@ant-design/icons';
import { Button, Col, Input, Row, Space, Typography, message } from 'antd';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { FirebaseError } from 'firebase/app';

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")

  const loginUser:FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
        const user = await signInWithEmailAndPassword(auth, email, password);

        setEmail("");
        setPassword("");
    } catch (error) {
        if (error instanceof FirebaseError) {
            const {code} = error;
            console.log(error);
            
            if (code == "auth/invalid-email")
                message.error("Invalid email address")
            else if (code == "auth/missing-password")
                message.error("Invalid password")
            else if (code == "auth/user-not-found")
                message.error("User not found")
            else if ("auth/wrong-password")
                message.error("Wrong credentials")
            else
                message.error("Something went wrong")
        }
    }
  }

  return (
    <main>
        <Row style={{minHeight:"70vh", alignItems:"center"}}>
        <Col span={12} offset={6}>
            <Typography.Title style={{textAlign: "center"}}>Log In</Typography.Title>
                <form onSubmit={loginUser}>
                    <Space direction="vertical" size="large" style={{ display:"flex"}}>
                        <Space direction="vertical" style={{ display:"flex"}}>
                            <label htmlFor="email">Email</label>
                            <Input value={email} onChange={e=>setEmail(e.target.value)} />
                        </Space>
                        <Space direction="vertical" style={{ display:"flex"}}>
                            <label htmlFor="password">Password</label>
                            <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                        </Space>
                        <Button htmlType="submit" type="primary" block>Log In</Button>
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