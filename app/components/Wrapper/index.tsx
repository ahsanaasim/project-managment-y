import { Col, Row } from 'antd'
import React, { ReactNode } from 'react'

const index = ({children}:{children: ReactNode}) => {
  return <Row>
    <Col span={20} offset={2}>{children}</Col>
  </Row>
}

export default index