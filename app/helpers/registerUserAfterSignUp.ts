import { collection, doc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db } from "../firebase";

const registerUserAfterSignUp = async (username: string, email: string) => {
  const companyDocumentRef = doc(collection(db, "companies"));
  await setDoc(companyDocumentRef, {
    company_id: nanoid(),
    company_name: "",
    company_admin_email: "",
    // projects: [],
    users: [
      {
        user_id: nanoid(),
        user_name: username,
        user_email: email,
        role_id: [],
        user_permissions: "",
      },
    ],
    roles: [],
  });
};

export default registerUserAfterSignUp;
