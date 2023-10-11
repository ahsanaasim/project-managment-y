import { collection, doc, getDocs, query, where } from "firebase/firestore";
import useCompanyRef from "./useCompanyRef";
import { db } from "../firebase";

const useProjectRef = () => {
  const getCompanyRef = useCompanyRef();

  const getProjectRef = async (projectId: string) => {
    const companyRef = await getCompanyRef();
    const projectsRef = collection(companyRef, "projects");
    const projectQuery = query(
      projectsRef,
      where("project_id", "==", projectId)
    );
    const projectDoc = (await getDocs(projectQuery)).docs[0];
    const projectDocRef = doc(companyRef, "projects", projectDoc.id);

    return projectDocRef;
  };

  return getProjectRef;
};

export default useProjectRef;
