"use client";
import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react";
import useProjectRef from "../hooks/useProject";
import { getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
// import { Project, ProjectContext } from "@/global";
import { nanoid } from "nanoid";
import useProject from "../hooks/useProject";

const projectState = {
  project_id: "",
  project_name: "",
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

const context = createContext<ProjectContext>({ project: projectState });

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [project, setProject] = useState<Project>(projectState);
  const [loadingProject, setLoadingProject] = useState(false);
  const getProject = useProject();
  const path = usePathname();
  const projectId = path.split("/")[2];

  useEffect(() => {
    (async () => {
      const project = await getProject(projectId);

      setProject({ ...(project as unknown as Project) });
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
