"use client";
import React from 'react'
import { Col, Row } from 'antd';
import Navbar from '../components/Navbar';


const layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => <main>
    <Row>
        <Col span={4}>
            <Navbar />
        </Col>
        <Col span={20}>{children}</Col>
    </Row>
</main>

export default layout