"use client";
import Wrapper from '@/app/components/Wrapper'
import { Button, Input, Space, Table, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table';
import { nanoid } from 'nanoid';
import React, { ReactNode, useState } from 'react'
import AddRowButton from '../AddRowButton';
import ProjectFlowFooter from '../ProjectFlowFooter';
import { CloseOutlined, MinusCircleOutlined } from '@ant-design/icons';

const stakeholders = [
  "name 1",
  "name 2",
  "name 3",
  "name 4"
]

type DataType = {
  [key: string]: string | string[],
  key: string,
  deliverable: string,
  responsible: string[],
  accountable: string[],
  consulted: string[],
  informed: string[]
}

const Page = () => {
  const [data, setData] = useState<DataType[]>([{
    key: nanoid(),
    deliverable: "deliverable 1",
    responsible: [],
    accountable: [],
    consulted: [],
    informed: []
  },
  {
    key: nanoid(),
    deliverable: "deliverable 2",
    responsible: [],
    accountable: [],
    consulted: [],
    informed: []
  }])
    const handleOnDrop = (e: React.DragEvent, column: keyof DataType, rowKey: string) => {
      setData([...data.map(row => {
        if (row.key == rowKey) {
          if (column == "responsible") {
            return {...row, responsible : [...row.responsible, e.dataTransfer.getData("text/plain")]}
          } else if (column == "accountable") {
            return {...row, accountable : [...row.accountable, e.dataTransfer.getData("text/plain")]}
          } else if (column == "consulted") {
            return {...row, consulted : [...row.consulted, e.dataTransfer.getData("text/plain")]}
          } else if (column == "informed") {
            return {...row, informed : [...row.informed, e.dataTransfer.getData("text/plain")]}
          } else return {...row}
        } else return {...row}
      })])
    }

    const onDragHandler = (e: React.DragEvent, stakeholder: string) => {
      e.dataTransfer.setData("text/plain", stakeholder)
    }

    const removeStakeholder = (name:string, rowKey: string, column: string) => {
      setData([...data.map(row => {
        if (rowKey == row.key) {
          console.log(row[column]);
          
          return {...row, [column]: [...(row[column] as string[]).filter(stakeholder => stakeholder != name)]}
        } else return {...row}
      })])
    }

    const renderStakeholders = (rowData: string[], rowKey: string, column: string) => {
      return <ul style={{listStyle:"none", paddingInlineStart:0}} onDrop={e=>handleOnDrop(e, column, rowKey)} onDragOver={e=>e.preventDefault()}>
        {
          rowData.length == 0 ? <Tag>Drop Here</Tag> : <Space size={[0, 8]} wrap>
          {
              rowData.map((stakeholder, index) => {
                  return <li key={index} style={{listStylePosition:"inside", display:"inline-block"}}>
                      <Tag color='blue'>{stakeholder} <CloseOutlined style={{cursor:"pointer"}} onClick={()=>removeStakeholder(stakeholder, rowKey, column)} /></Tag>
                  </li>
              } )
          }
        </Space>
        }
      </ul>
    }

  const addRow = () => {
      setData([...data, {
        key: nanoid(),
        deliverable: "",
        responsible: [],
        accountable: [],
        consulted: [],
        informed: []
      }])
  }

  const deleteRow = (key: string) => {
    setData([...data.filter(row => row.key != key)])
  }
    
  return <Wrapper>
              <Typography.Title>RACI</Typography.Title>
              <Typography.Text>Stakeholders</Typography.Text>
              <ul style={{listStyle:"none", paddingInlineStart:0}}>
                <Space size={[0, 8]} wrap>
                    {
                        stakeholders.map((stakeholder, index) => {
                            return <li key={index} style={{listStylePosition:"inside", display:"inline-block", cursor:"grabbing"}} draggable onDragStart={e=>onDragHandler(e, stakeholder)}>
                                <Tag color='blue'>{stakeholder}</Tag>
                            </li>
                        } )
                    }
                  </Space>
              </ul>
              <Table dataSource={data} style={{marginTop:"2rem"}} pagination={false}>
                <Table.Column title="Deliverable" dataIndex="deliverable" key="deliverable" render={(rowData,record:{key:string}, index) => <Input value={rowData} />} />
                <Table.Column title="Responsible" dataIndex="responsible" key="responsible" render={(rowData,record:{key:string}, index) => renderStakeholders(rowData, record.key, "responsible") } />
                <Table.Column title="Accountable" dataIndex="accountable" key="accountable" render={(rowData,record:{key:string}, index) => renderStakeholders(rowData, record.key, "accountable") } />
                <Table.Column title="Consulted" dataIndex="consulted" key="consulted" render={(rowData,record:{key:string}, index) => renderStakeholders(rowData, record.key, "consulted") } />
                <Table.Column title="Informed" dataIndex="informed" key="informed" render={(rowData,record:{key:string}, index) => renderStakeholders(rowData, record.key, "informed") } />
                <Table.Column render={(rowData, record:{key: string}, index)=><Button onClick={()=>deleteRow(record.key)} icon={<MinusCircleOutlined />} danger></Button>} />
              </Table>
              <br /><br />
              <AddRowButton addRow={addRow} />
              <ProjectFlowFooter previous={3} next={5} />
  </Wrapper>
}

export default Page