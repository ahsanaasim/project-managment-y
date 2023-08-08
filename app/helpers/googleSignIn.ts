import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const useGoogleSignIn = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    const response = await signInWithPopup(auth, new GoogleAuthProvider());

    let users = (await getDocs(collection(db, "users"))).docs;
    const userEmails = users.map((user) => user.data().user_email_address);

    if (response.user.email) {
      if (!userEmails.includes(response.user.email)) {
        // user collection
        const userDocumentRef = doc(collection(db, "users"));
        await setDoc(userDocumentRef, {
          user_email_address: response.user.email,
        });
      }
    }

    router.push("/project/1");
  };

  return signInWithGoogle;
};

export default useGoogleSignIn;
