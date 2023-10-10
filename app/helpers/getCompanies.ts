import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const getCompanies = async () => {
  const companiesRef = collection(db, "companies");

  const companies = await getDocs(companiesRef);

  return companies.docs.map((doc) => doc.data());
};

export default getCompanies;
