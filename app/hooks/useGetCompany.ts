import { User } from "firebase/auth";
import { useAppContext } from "../context/AppProvider";
import getCompanies from "../helpers/getCompanies";

const useGetCompany = () => {
  const getCompany = async (user: User) => {
    if (!user) return null;

    const companies = (await getCompanies()) as unknown as Company[];
    const noOfCompanies = companies.length;

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];

      const tempUser = company.users.filter(
        (tempUser) => tempUser.user_email == user.email
      );

      // if (!tempUser.length) return null;

      if (tempUser.length) return company;
    }

    return null;
  };

  return getCompany;
};

export default useGetCompany;
