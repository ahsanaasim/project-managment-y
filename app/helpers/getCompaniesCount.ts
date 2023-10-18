import getCompanies from "./getCompanies";

const getCompaniesCount = async () => {
  return (await getCompanies()).length;
};

export default getCompaniesCount;
