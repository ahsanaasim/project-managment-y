import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useAppContext } from "../context/AppProvider";
import { db } from "../firebase";

const useProjectsCollectionRef = () => {
    const user = useAppContext();

    const getProjectsCollectionRef = async () => {
        const usersCollectionRef = collection(db, "users");
        const userQuery = query(usersCollectionRef, where("user_email_address", "==", user?.
        email));
        const userDoc = (await getDocs(userQuery)).docs[0];
        const userDocRef = doc(db, "users", userDoc.id);
        const projectsCollectionRef = collection(userDocRef, "projects");

        return projectsCollectionRef;
    }

    return getProjectsCollectionRef;
}

export default useProjectsCollectionRef;