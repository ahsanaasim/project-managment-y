"use client";

import Wrapper from "@/app/components/Wrapper";
import { Button, Input, Space, Typography, message } from "antd";
import ProjectList from "./ProjectList";
import { FormEventHandler, useEffect, useState } from "react";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { useAppContext } from "@/app/context/AppProvider";
import { nanoid } from "nanoid";
import useUserProjects from "@/app/hooks/useUserProjects";
import TopMenu from "@/app/components/TopMenu";
import NoSSR from "@/app/components/NoSSR";
import FullpageLoader from "@/app/components/FullpageLoader";
import { useRouter } from "next/navigation";
import getCompanies from "@/app/helpers/getCompanies";
import getCompaniesCount from "@/app/helpers/getCompaniesCount";
import useProjects from "@/app/hooks/useProjects";

const Page = () => {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState<DocumentData[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const { user, loadingUser } = useAppContext();
  const getProjects = useProjects();
  const router = useRouter();

  const createProject: FormEventHandler = async (e) => {
    e.preventDefault();
    setFetchingProjects(true);

    try {
      // not loggedin
      if (!user) return router.push("/auth");
      // all companies
      const companies = (await getCompanies()) as unknown as Company[];
      const noOfCompanies = await getCompaniesCount();

      for (let i = 0; i < noOfCompanies; i += 1) {
        const company = companies[i];
        const tempUser = company.users[0];
        const projects = company.projects;

        if (tempUser.user_email == user.email) {
          const newProject: Project = {
            project_id: nanoid(),
            project_name: name,
            project_overview: "",
            project_problem: "",
            project_purpose: "",
            project_scope: "",
            project_link_to_plan: "",
            project_budget: "",
            project_outcomes_and_metrics: [],
            project_stakeholders: [],
            project_raci_deliverables: [],
            project_working_groups: [],
            project_documents: [],
            project_recommendations_general: "",
            project_recommendations_stakeholder: [],
            status_updates: [],
          };
          projects.push(newProject);

          const companiesRef = collection(db, "companies");
          const companyQuery = query(
            companiesRef,
            where("company_id", "==", company.company_id)
          );
          const querySnapshot = await getDocs(companyQuery);

          querySnapshot.forEach(async (companyDoc) => {
            const companyDocRef = doc(db, "companies", companyDoc.id);
            const projectsCollectionRef = collection(companyDocRef, "projects");

            // Add the new project document to the projects sub-collection with a unique ID
            await addDoc(projectsCollectionRef, newProject);

            setProjects(await getProjects());
            setFetchingProjects(false);
            setName("");
          });
        }
      }

      console.log(user?.email);
    } catch (error) {}
  };

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        router.push("/auth");
      } else {
        (async () => {
          setProjects(await getProjects());
          console.log(await getProjects());

          setFetchingProjects(false);
        })();
      }
    }
  }, [loadingUser]);

  if (loadingUser || !user) return <FullpageLoader />;

  return (
    <NoSSR>
      <TopMenu />

      <Wrapper>
        <Typography.Title>Create a New Project</Typography.Title>
        <form onSubmit={createProject}>
          <Space
            direction="vertical"
            size="large"
            style={{ display: "flex", width: "50%" }}
          >
            <Space direction="vertical" style={{ display: "flex" }}>
              <label htmlFor="project-name">Project Name</label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="project-name"
                id="project-name"
              />
            </Space>
            <Button htmlType="submit" type="primary" block>
              Create Project
            </Button>
          </Space>
        </form>
        <ProjectList projects={projects} fetchingProjects={fetchingProjects} />
      </Wrapper>
    </NoSSR>
  );
};

export default Page;
