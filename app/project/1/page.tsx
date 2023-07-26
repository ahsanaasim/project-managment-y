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

const Page = () => {
  const [name, setName] = useState("");
  const [projects, setProjects] = useState<DocumentData[]>([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const user = useAppContext();
  const getUserProjects = useUserProjects();

  const createProject: FormEventHandler = async (e) => {
    e.preventDefault();
    setFetchingProjects(true);

    try {
      // save in firestore
      const usersCollectionRef = collection(db, "users");
      const userQuery = query(
        usersCollectionRef,
        where("user_email_address", "==", user?.email)
      );

      const querySnapshot = await getDocs(userQuery);

      querySnapshot.forEach(async (userDoc) => {
        const userDocRef = doc(db, "users", userDoc.id);
        const projectsCollectionRef = collection(userDocRef, "projects");

        // Add the new project document to the projects sub-collection with a unique ID
        await addDoc(projectsCollectionRef, {
          project_id: nanoid(),
          project_name: name,
          project_overview: "",
          project_problem: "",
          project_purpose: "",
          project_scope: "",
          project_link_to_plan: "",
          project_budget: "",
          project_outcomes_and_metrics: [
            {
              project_metric: "",
              project_outcome: "",
              item_id: nanoid(),
            },
          ],
          project_stakeholders: [
            {
              project_stakeholder_email: "",
              project_stakeholder_id: nanoid(),
              project_stakeholder_name: "",
              project_stakeholder_role: "",
            },
          ],
          project_raci_items: [
            {
              raci_item_key: nanoid(),
              project_raci_deliverable: "",
              project_raci_responsible_stakeholder_ids: [],
              project_raci_accountable_stakeholder_ids: [],
              project_raci_consulted_stakeholder_ids: [],
              project_raci_informed_stakeholder_ids: [],
            },
          ],
          project_working_groups: [
            {
              project_working_group_id: nanoid(),
              project_working_group_title: "",
              project_working_group_item: [
                {
                  key: nanoid(),
                  project_working_group_responsibilities: "",
                  project_working_group_role: "",
                  project_working_group_stakeholders: [],
                },
              ],
            },
          ],
          project_documents: [],
          project_recommendations_general: "",
          project_recommendations_stakeholder: [
            {
              project_recommendations_stakeholder_id: nanoid(),
              project_recommendations_competencies: "",
              project_recommendations_resources: "",
            },
          ],
        });

        setProjects(await getUserProjects());
        setFetchingProjects(false);
        setName("");
      });
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      setProjects(await getUserProjects());
      setFetchingProjects(false);
    })();
  }, []);

  console.table(projects);

  return (
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
  );
};

export default Page;
