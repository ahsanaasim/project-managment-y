import { getDocs } from "firebase/firestore";
import useProjectsCollectionRef from "./useProjectsCollectionRef";

const useUserProjects = () => {
    const getProjectsCollectionRef = useProjectsCollectionRef()

    const getUserProjects = async () => {
        const projectsCollectionRef = await getProjectsCollectionRef();

        return [...(await getDocs(projectsCollectionRef)).docs].map(project => project.data());
    }

    return getUserProjects;
}

export default useUserProjects;