import { doc, getDocs, query, where } from "firebase/firestore";
import useProjectsCollectionRef from "./useProjectsCollectionRef";
import useUserRef from "./useUserRef";

const useProjectRef = () => {
    const getProjectsCollectionRef = useProjectsCollectionRef();
    const getUserRef = useUserRef()

    const getProjectRef = async (projectId: string) => {

        const projectsCollectionRef = await getProjectsCollectionRef()
        const projectQuery = query(projectsCollectionRef, where("project_id", "==", projectId));
        const projectDoc = (await getDocs(projectQuery)).docs[0];
        const projectDocRef = doc(await getUserRef(), "projects", projectDoc.id);

        return projectDocRef;
    }

    return getProjectRef;
}

export default useProjectRef;