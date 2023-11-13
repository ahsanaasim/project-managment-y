import { doc, getDocs, query, where } from "firebase/firestore";
import useProjectsCollectionRef from "./useProjectsCollectionRef";
import useUserRef from "./useUserRef";
import useProjects from "./useProjects";
import { User } from "firebase/auth";

const useProject = () => {
  const getProjects = useProjects();

  const getProject = async (user: User, projectId: string) => {
    const projects = await getProjects(user);

    return projects.filter((project) => project.project_id == projectId)[0];
  };

  return getProject;
};

export default useProject;
