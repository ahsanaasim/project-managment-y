import { collection, getDocs } from "firebase/firestore";
import useCompanyRef from "./useCompanyRef";
import { User } from "firebase/auth";

const useProjects = () => {
  const getCompanyRef = useCompanyRef();

  const getProjects = async (user: User) => {
    const projectsCollectionRef = collection(
      await getCompanyRef(user),
      "projects"
    );

    return (await getDocs(projectsCollectionRef)).docs.map((snapshot) =>
      snapshot.data()
    );
  };

  return getProjects;
};

export default useProjects;
