import getCompanies from "./getCompanies";

const checkUsernameAvailability = async (username: string) => {
  const companies = (await getCompanies()) as unknown as Company[];
  const noOfCompanies = companies.length;

  for (let i = 0; i < noOfCompanies; i += 1) {
    const company = companies[i];
    const { users } = company;
    const noOfUsers = users.length;

    for (let j = 0; j < noOfUsers; j += 1) {
      if (users[j].user_name == username) return true;
      else false;
    }
  }
};

export default checkUsernameAvailability;
