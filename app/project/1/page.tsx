"use client";

import Wrapper from "@/app/components/Wrapper";
import { Button, Input, Space, Typography, message } from "antd";
import ProjectList from "./ProjectList";
import { FormEventHandler, useEffect, useState } from "react";
import { DocumentData, addDoc, collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";
import { useAppContext } from "@/app/context/AppProvider";
import { nanoid } from "nanoid";
import useUserProjects from "@/app/hooks/useUserProjects";

const Page = () => {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState<DocumentData[]>([])
  const [fetchingProjects, setFetchingProjects] = useState(true)
  const user = useAppContext()
  const getUserProjects = useUserProjects()

  const createProject:FormEventHandler = async (e) => {
    e.preventDefault();
    setFetchingProjects(true)

    try {
      // save in firestore
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(usersCollectionRef, where("user_email_address", "==", user?.email));

      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach(async (userDoc) => {
        const userDocRef = doc(db, "users", userDoc.id);
        const projectsCollectionRef = collection(userDocRef, "projects");
        
        // Add the new project document to the projects sub-collection with a unique ID
        await addDoc(projectsCollectionRef, {
            project_id: nanoid(),
            project_name: name
        });

        setProjects(await getUserProjects())
        setFetchingProjects(false)
        setName("")
      });
    } catch (error) {
      message.error("Something went wrong")
      console.log(error);
    }
  }

  useEffect(()=>{
    (async () => {
      setProjects(await getUserProjects())
      setFetchingProjects(false)
    })()
  }, [])

  console.table(projects);
  
  return <Wrapper>
    <Typography.Title>Create a New Project</Typography.Title>
    <form onSubmit={createProject}>
        <Space direction="vertical" size="large" style={{ display:"flex", width:"50%"}}>
            <Space direction="vertical" style={{display:"flex"}}>
                <label htmlFor="project-name">Project Name</label>
                <Input value={name} onChange={e=>setName(e.target.value)} name="project-name" id="project-name" />
            </Space>
            <Button htmlType="submit" type="primary" block>Create Project</Button>
        </Space>
    </form>
    <ProjectList projects={projects} fetchingProjects={fetchingProjects} />
  </Wrapper>
}

export default Page;