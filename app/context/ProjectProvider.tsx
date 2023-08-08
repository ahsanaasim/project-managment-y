"use client";
import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import useProjectRef from "../hooks/useProjectRef";
import { getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { Project, ProjectContext } from "@/global";
import { nanoid } from "nanoid";

const projectState = {
  project_id: "",
  project_name: "",
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
      key: nanoid(),
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
    // {
    //   project_recommendations_stakeholder_id: nanoid(),
    //   project_recommendations_competencies: "",
    //   project_recommendations_resources: "",
    // },
  ],
};

const context = createContext<ProjectContext>({ project: projectState });

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [project, setProject] = useState<Project>(projectState);
  const [loadingProject, setLoadingProject] = useState(true);
  const getProjectRef = useProjectRef();
  const path = usePathname();
  const projectId = path.split("/")[2];

  useEffect(() => {
    (async () => {
      const projectRef = await getProjectRef(projectId);
      const project = await getDoc(projectRef);
      const data = project.data();

      setProject({ ...(data as Project) });
      setLoadingProject(false);
    })();
  }, []);

  return (
    <context.Provider value={{ project, setProject }}>
      <Spin spinning={loadingProject} tip="Loading project">
        {children}
      </Spin>
    </context.Provider>
  );
};

export const useProjectContext = () => useContext(context);
export default ProjectProvider;
