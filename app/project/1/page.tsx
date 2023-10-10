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

const Page = () => {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState<DocumentData[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const { user, loadingUser } = useAppContext();
  const getUserProjects = useUserProjects();
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

        console.log(company);

        if (tempUser.user_email == user.email) {
          console.log("matched");
          console.log(tempUser);
          console.log(user);

          const newProject = {
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

            setProjects(await getUserProjects());
            setFetchingProjects(false);
            setName("");
          });
        }
      }

      console.log(user?.email);
    } catch (error) {}

    // try {
    //   // save in firestore
    //   const usersCollectionRef = collection(db, "users");
    //   const userQuery = query(
    //     usersCollectionRef,
    //     where("user_email_address", "==", user?.email)
    //   );

    //   const querySnapshot = await getDocs(userQuery);

    //   querySnapshot.forEach(async (userDoc) => {
    //     const userDocRef = doc(db, "users", userDoc.id);
    //     const projectsCollectionRef = collection(userDocRef, "projects");

    //     // Add the new project document to the projects sub-collection with a unique ID
    //     await addDoc(projectsCollectionRef, {
    //       project_id: nanoid(),
    //       project_name: name,
    //       project_overview: "",
    //       project_problem: "",
    //       project_purpose: "",
    //       project_scope: "",
    //       project_link_to_plan: "",
    //       project_budget: "",
    //       project_outcomes_and_metrics: [
    //         {
    //           project_metric: "",
    //           project_outcome: "",
    //           item_id: nanoid(),
    //         },
    //       ],
    //       project_stakeholders: [],
    //       project_raci_items: [
    //         {
    //           raci_item_key: nanoid(),
    //           project_raci_deliverable: "",
    //           project_raci_responsible_stakeholder_ids: [],
    //           project_raci_accountable_stakeholder_ids: [],
    //           project_raci_consulted_stakeholder_ids: [],
    //           project_raci_informed_stakeholder_ids: [],
    //         },
    //       ],
    //       project_working_groups: [],
    //       project_documents: [],
    //       project_recommendations_general: "",
    //       project_recommendations_stakeholder: [],
    //     });

    //     setProjects(await getUserProjects());
    //     setFetchingProjects(false);
    //     setName("");
    //   });
    // } catch (error) {
    //   message.error("Something went wrong");
    //   console.log(error);
    // }
  };

  useEffect(() => {
    if (!loadingUser) {
      if (!user) {
        router.push("/auth");
      } else {
        (async () => {
          setProjects(await getUserProjects());
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
