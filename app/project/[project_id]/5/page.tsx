"use client";
import Wrapper from '@/app/components/Wrapper';
import { Button, Divider, Input, Modal, Space, Table, Tag, Typography } from 'antd'
import { nanoid } from 'nanoid';
import React, { useState } from 'react'
import AddRowButton from '../AddRowButton';
import { CloseOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ProjectFlowFooter from '../ProjectFlowFooter';
import { WorkingGroupTable } from '@/global';

const stakeholders = [
    "name 1",
    "name 2",
    "name 3",
    "name 4"
  ]

const Page = () => {
    const [tableData, setTableData] = useState<WorkingGroupTable[]>([
        {
            id: nanoid(),
            name: "table 1",
            rows: [
                {
                    key: nanoid(),
                    role: "role 1",
                    responsibilities: "responsibility 1",
                    stakeholders: ["a", "b", "c"]
                }
            ]
        },
        {
            id: nanoid(),
            name: "table 2",
            rows: [
                {
                    key: nanoid(),
                    role: "role 2",
                    responsibilities: "responsibility 2",
                    stakeholders: ["a", "b", "c"]
                }
            ]
        }
    ])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("")

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setTableData([...tableData, {
            id: nanoid(),
            name: newGroupName,
            rows: [
                {
                    key: nanoid(),
                    role: "",
                    responsibilities: "",
                    stakeholders: []
                }
            ]
        }
        ])
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onDragHandler = (e: React.DragEvent, stakeholder: string) => {
        e.dataTransfer.setData("text/plain",stakeholder)
      }

      const addTable = () => {
        console.log("clicked");
        
        showModal();
      }

      const handleOnDrop = (e: React.DragEvent, rowKey: string, tableKey: string) => {
        setTableData([...tableData.map(table => {
            if (table.id == tableKey) {
                return {
                    ...table,
                    rows: [
                        ...table.rows.map(row => {
                            if (row.key == rowKey) {
                                console.log("new row",{
                                    ...row,
                                    stakeholders: [...row.stakeholders, e.dataTransfer.getData("text/plain")]
                                });
                                
                                return {
                                    ...row,
                                    stakeholders: [...row.stakeholders, e.dataTransfer.getData("text/plain")]
                                }
                            } else return {...row}
                        })
                    ]
                }
            } else return {...table}
        })])
      }

      const removeStakeholder = (name:string, tableId: string, rowKey: string) => {
        setTableData([...tableData.map(table => {
            if (table.id == tableId) {
                return {
                    ...table,
                    rows: [
                        ...table.rows.map(row => {
                            if (row.key == rowKey) {
                                return {...row, stakeholders: row.stakeholders.filter(stakeholder => stakeholder != name)}
                            } else return {...row}
                        })
                    ]
                }
            } else return {...table}
        })])
      }

      const renderStakeholders = (rowData: string[], rowKey: string, tableKey: string) => {
        return <ul style={{listStyle:"none", paddingInlineStart:0}} onDrop={e=>handleOnDrop(e, rowKey, tableKey)} onDragOver={e=>e.preventDefault()}>
          {
            rowData.length == 0 ? <Tag>Drop Here</Tag> : <Space size={[0, 8]} wrap>
            {
                rowData.map((stakeholder, index) => {
                    return <li key={index} style={{listStylePosition:"inside", display:"inline-block"}}>
                        <Tag color='blue'>{stakeholder} <CloseOutlined style={{cursor:"pointer"}} onClick={()=>removeStakeholder(stakeholder, tableKey, rowKey)} /></Tag>
                    </li>
                } )
            }
          </Space>
          }
        </ul>
      }
  
      const addRow = (tableId: string) => {
        setTableData([...tableData.map(table => {
            if (table.id == tableId) {
                return {
                    ...table,
                    rows: [...table.rows, {
                        key: nanoid(),
                        role: "",
                        responsibilities: "",
                        stakeholders: []
                    }]
                }
            } else return {...table}
        })])
      }

      const deleteRow = (tableId: string, rowKey: string) => {
        setTableData([...tableData.map(table => {
            if (table.id == tableId) {
                return {
                    ...table,
                    rows: [
                        ...table.rows.filter(row => row.key != rowKey)
                    ]
                }
            } else return {...table}
        })])
      }

  return (
    <Wrapper>
        <div>
            <Modal title="Create Working Group" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <form>
                    <Input value={newGroupName} onChange={e=>setNewGroupName(e.target.value)} placeholder='Working group name' />
                </form>
            </Modal>
            <Typography.Title>Working Groups</Typography.Title>
            <Typography.Text>Stakeholders</Typography.Text>
            <ul style={{listStyle:"none", paddingInlineStart:0}}>
                <Space size={[0, 8]} wrap>
                    {
                        stakeholders.map((stakeholder, index) => {
                            return <li key={index} style={{listStylePosition:'inside', display:'inline-block', cursor:"grabbing"}} draggable onDragStart={e=>onDragHandler(e, stakeholder)}>
                                <Tag color='blue'>
                                    {stakeholder}
                                </Tag>
                            </li>
                        })
                    }
                </Space>
            </ul>
            {
                tableData.map((table, index) => {
                    return <div key={index} style={{marginTop:'1rem'}}>
                        <Typography.Text>{table.name}</Typography.Text>
                        <Table dataSource={table.rows} style={{marginTop:"2rem"}} pagination={false}>
                            <Table.Column title="Role" dataIndex="role" key="role" render={(rowData,record:{key:string}, index) => <Input value={rowData} />} />
                            <Table.Column title="Responsibilities" dataIndex="responsibilities" key="responsibilities" render={(rowData,record:{key:string}, index) => <Input value={rowData} />} />
                            <Table.Column title="Stakeholders" dataIndex="stakeholders" key="stakeholders" render={(rowData,record:{key:string}, index) => renderStakeholders(rowData, record.key, table.id) } />
                            <Table.Column render={(rowData, record:{key: string}, index)=><Button onClick={()=>deleteRow(table.id, record.key)} icon={<MinusCircleOutlined />} danger></Button>} />
                        </Table>
                        <br />
                        <Button onClick={()=>addRow(table.id)} icon={<PlusCircleOutlined />}>Add Row</Button>
                        <Divider />
                    </div>
                })
            }
            <br />
            <Button type="primary" onClick={addTable} icon={<PlusCircleOutlined />}>Add Working Group</Button>
        </div>
        <ProjectFlowFooter previous={4} next={6} />
    </Wrapper>
  )
}

export default Page