import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAppContext } from "../context/AppProvider";

const useFilterUserByEmail = () => {
  const { user } = useAppContext();

  const filterUserByEmail = async () => {
    const usersCollectionRef = collection(db, "users");
    const userQuery = query(
      usersCollectionRef,
      where("user_email_address", "==", user?.email)
    );

    return (await getDocs(userQuery)).docs[0];
  };

  return filterUserByEmail;
};

export default useFilterUserByEmail;
