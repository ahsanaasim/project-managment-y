import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import useFilterUserByEmail from "./useFilterUserByEmail";
import { db } from "../firebase";
import { useAppContext } from "../context/AppProvider";

const useUserProjects = () => {
    const user = useAppContext();

    const getUserProjects = async () => {
        const usersCollectionRef = collection(db, "users");
        const userQuery = query(usersCollectionRef, where("user_email_address", "==", user?.
        email));
        const userDoc = (await getDocs(userQuery)).docs[0];
        const userDocRef = doc(db, "users", userDoc.id);
        const projectsCollectionRef = collection(userDocRef, "projects");

        return [...(await getDocs(projectsCollectionRef)).docs].map(project => project.data());
    }

    return getUserProjects;
}

export default useUserProjects;