import { Button, Space } from 'antd'
import React from 'react'

const ProjectFlowFooter = ({previous, next} : {previous: number, next: number}) => {
  return <Space style={{margin:"2rem 0", display: "flex", justifyContent: "center"}}>
  <Button href={`/project/${previous}`} type="primary" style={{width: "200px"}}>Back</Button>
  <Button href={`/project/${next}`} type="primary" style={{width: "200px"}}>Next</Button>
</Space>
}

export default ProjectFlowFooter