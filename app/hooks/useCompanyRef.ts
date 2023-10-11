import { collection, doc, getDocs, query, where } from "firebase/firestore";
import useGetCompany from "./useGetCompany";
import { db } from "../firebase";

const useCompanyRef = () => {
  const getCompany = useGetCompany();

  const getCompanyRef = async () => {
    const company = await getCompany();

    const companiesCollectionRef = collection(db, "companies");
    const companyQuery = query(
      companiesCollectionRef,
      where("company_id", "==", company?.company_id)
    );
    const companyDoc = (await getDocs(companyQuery)).docs[0];
    const companyDocRef = doc(db, "companies", companyDoc.id);

    return companyDocRef;
  };

  return getCompanyRef;
};

export default useCompanyRef;
