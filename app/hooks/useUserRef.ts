import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useAppContext } from "../context/AppProvider";
import { db } from "../firebase";

const useUserRef = () => {
    const user = useAppContext();
    
    const getUserRef = async () => {
        const usersCollectionRef = collection(db, "users");
        const userQuery = query(usersCollectionRef, where("user_email_address", "==", user?.
        email));
        const userDoc = (await getDocs(userQuery)).docs[0];
        const userDocRef = doc(db, "users", userDoc.id);

        return userDocRef;
    }

    return getUserRef;
}

export default useUserRef;