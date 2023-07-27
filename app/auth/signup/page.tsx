"use client";
import React, { FormEventHandler, useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Space, Typography, message } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { FirebaseError } from "firebase/app";
import { collection, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const createUser: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setEmail("");
      setPassword("");

      // user collection
      const userDocumentRef = doc(collection(db, "users"));
      await setDoc(userDocumentRef, {
        user_email_address: response.user.email,
      });

      // projects sub collection
      // const projectsCollectionRef = collection(userDocumentRef, "projects");
      // const projectDocumentRef = doc(projectsCollectionRef);
      // await setDoc(projectDocumentRef, {})

      router.push("/project/1");
    } catch (error) {
      if (error instanceof FirebaseError) {
        const { code } = error;

        if (code == "auth/invalid-email")
          message.error("Invalid email address");
        else if (code == "auth/missing-password")
          message.error("Invalid password");
        else if (code == "auth/weak-password")
          message.error("Password should be at least 6 characters");
        else if (code == "auth/email-already-in-use")
          message.error("Email address already in use");
        else {
          message.error("Something went wrong");
          console.log(error);
        }
      }
    }
  };

  return (
    <main>
      <Row style={{ minHeight: "70vh", alignItems: "center" }}>
        <Col span={12} offset={6}>
          <Typography.Title style={{ textAlign: "center" }}>
            Sign Up
          </Typography.Title>
          <form onSubmit={createUser}>
            <Space
              direction="vertical"
              size="large"
              style={{ display: "flex" }}
            >
              <Space direction="vertical" style={{ display: "flex" }}>
                <label htmlFor="email">Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Space>
              <Space direction="vertical" style={{ display: "flex" }}>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Space>
              <Button htmlType="submit" type="primary" block>
                Sign Up
              </Button>
              <Typography style={{ textAlign: "center" }}>or</Typography>
              <Button
                style={{
                  borderRadius: "50px",
                  margin: "0 auto",
                  display: "block",
                }}
                type="primary"
                icon={<GoogleOutlined />}
              >
                Continue with Google
              </Button>
            </Space>
          </form>
          <Button
            type="primary"
            style={{ margin: "2rem auto 0 auto" }}
            href="/auth"
            block
          >
            Back
          </Button>
        </Col>
      </Row>
    </main>
  );
};

export default App;
