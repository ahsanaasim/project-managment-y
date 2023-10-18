import { doc, getDocs, query, where } from "firebase/firestore";
import useProjectsCollectionRef from "./useProjectsCollectionRef";
import useUserRef from "./useUserRef";
import useProjects from "./useProjects";

const useProject = () => {
  const getProjects = useProjects();

  const getProject = async (projectId: string) => {
    const projects = await getProjects();

    return projects.filter((project) => project.project_id == projectId)[0];
  };

  return getProject;
};

export default useProject;
