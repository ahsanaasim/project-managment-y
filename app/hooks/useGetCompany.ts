import { useAppContext } from "../context/AppProvider";
import getCompanies from "../helpers/getCompanies";

const useGetCompany = () => {
  const { user } = useAppContext();

  const getCompany = async () => {
    if (!user) return null;

    const companies = (await getCompanies()) as unknown as Company[];
    const noOfCompanies = companies.length;

    for (let i = 0; i < noOfCompanies; i += 1) {
      const company = companies[i];
      const tempUser = company.users[0];

      if (tempUser.user_email == user.email) {
        return company;
      }
    }

    return null;
  };

  return getCompany;
};

export default useGetCompany;
