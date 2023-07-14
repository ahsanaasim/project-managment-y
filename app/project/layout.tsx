"use client";
import React from 'react'
import { Col, Row } from 'antd';
import Navbar from '../components/Navbar';
import NoSSR from '../components/NoSSR';


const layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => <NoSSR>
          <main>
              <Row>
                  <Col span={4}>
                      <Navbar />
                  </Col>
                  <Col span={20}>{children}</Col>
              </Row>
          </main>
        </NoSSR>

export default layout