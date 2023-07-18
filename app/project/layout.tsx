"use client";
import React, { useEffect, useState } from 'react'
import { Col, Row, Spin } from 'antd';
import Navbar from '../components/Navbar';
import NoSSR from '../components/NoSSR';
import TopMenu from '../components/TopMenu';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Layout = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<null | User>(null)
    const router = useRouter();

    useEffect(() => {
      onAuthStateChanged(auth, currentUser => {
        // console.log(currentUser);
        if (!currentUser) router.push("/auth/login")

        setLoading(false)
        setUser(currentUser)
      })
    }, [router])

    return <NoSSR>
    <main>
        <TopMenu />
        {(loading || (!loading && !user)) && <div style={{minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center"}}><Spin tip="Loading" /></div> }
        {!loading && user && <Row>
            <Col span={4}>
                <Navbar />
            </Col>
            <Col span={20}>{children}</Col>
        </Row>}
    </main>
  </NoSSR>
  }

export default Layout