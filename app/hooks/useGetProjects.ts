import useGetCompany from "./useGetCompany";

const useGetProjects = async () => {
  const getCompany = await useGetCompany();

  const getProjects = async () => {
    const company = await getCompany();
    console.log(company);

    if (company) return company.projects;
    else return [];
  };

  return getProjects;
};

export default useGetProjects;
