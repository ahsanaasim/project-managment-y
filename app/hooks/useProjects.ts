import { collection, getDocs } from "firebase/firestore";
import useCompanyRef from "./useCompanyRef";

const useProjects = () => {
  const getCompanyRef = useCompanyRef();

  const getProjects = async () => {
    const projectsCollectionRef = collection(await getCompanyRef(), "projects");

    return (await getDocs(projectsCollectionRef)).docs.map((snapshot) =>
      snapshot.data()
    );
  };

  return getProjects;
};

export default useProjects;
