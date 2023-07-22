"use client";
import { auth } from '@/app/firebase';
import { Button, Divider, Typography } from 'antd'
import { signOut } from 'firebase/auth';
import React, { FormEventHandler } from 'react'
import Wrapper from '../Wrapper';
import { useAppContext } from '@/app/context/AppProvider';

const TopMenu = () => {
  const user = useAppContext()

  const logout: FormEventHandler = (e) => {
    e.preventDefault();
    signOut(auth)
  }
console.log(user);

  return <header>
    <Wrapper>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1rem 0"}}>
            <Typography.Title style={{margin: 0}} level={3}>Project Management</Typography.Title>
            {/* {(user != null) ? <Button href="/auth/login">Login</Button> : <Button type="primary" onClick={logout}>Logout</Button>} */}
            {!user ? <Button type="primary" href="/auth/login">Login</Button> : <Button type="primary" onClick={logout}>Logout</Button>}
        </div>
    </Wrapper>
    <Divider />
  </header>
}

export default TopMenu