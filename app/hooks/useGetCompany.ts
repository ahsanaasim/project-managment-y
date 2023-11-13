import { User } from "firebase/auth";
import { useAppContext } from "../context/AppProvider";
import getCompanies from "../helpers/getCompanies";

const useGetCompany = () => {
  // const { user } = useAppContext();
  // console.log("user ", user);

  const getCompany = async (user: User) => {
    if (!user) return null;

    const companies = (await getCompanies()) as unknown as Company[];
    const noOfCompanies = companies.length;

    console.log("noOfCompanies = ", noOfCompanies);

    for (let i = 0; i < companies.length; i++) {
      console.log("looping companies");
      const company = companies[i];
      console.log(company.company_id);

      console.log(company.users);

      const tempUser = company.users.filter(
        (tempUser) => tempUser.user_email == user.email
      );

      console.log(tempUser);

      // if (!tempUser.length) return null;

      if (tempUser.length) return company;
    }

    return null;
  };

  return getCompany;
};

export default useGetCompany;
