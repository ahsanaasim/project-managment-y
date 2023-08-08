import { collection, getDocs, query, where } from "firebase/firestore";
import { useAppContext } from "../context/AppProvider";
import { db } from "../firebase";

const useUserId = () => {
  const { user } = useAppContext();

  const getUserId = async () => {
    const usersCollectionRef = collection(db, "users");
    const userQuery = query(
      usersCollectionRef,
      where("user_email_address", "==", user?.email)
    );
    const userDoc = (await getDocs(userQuery)).docs[0];
    return userDoc.id;
  };

  return getUserId;
};

export default useUserId;
