const getStakeholderName = (id: string, project: Project) => {
  return project.project_stakeholders.filter(
    (stakeholder) => stakeholder.project_stakeholder_id == id
  )[0].project_stakeholder_name;
};

export default getStakeholderName;
