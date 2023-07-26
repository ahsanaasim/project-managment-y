import { type } from "os";

type WorkingGroupRow = {
  key: string;
  role: string;
  responsibilities: string;
  stakeholders: string[];
};

type WorkingGroupTable = {
  id: string;
  name: string;
  rows: WorkingGroupRow[];
};

type OutcomeMetric = {
  project_metric: string;
  project_outcome: string;
  item_id: string;
};

type Stakeholder = {
  project_stakeholder_email: string;
  project_stakeholder_id: string;
  project_stakeholder_name: string;
  project_stakeholder_role: string;
};

type RaciItem = {
  [key: string]: string | string[];
  key: string;
  project_raci_deliverable: string;
  project_raci_responsible_stakeholder_ids: string[];
  project_raci_accountable_stakeholder_ids: string[];
  project_raci_consulted_stakeholder_ids: string[];
  project_raci_informed_stakeholder_ids: string[];
};

type WorkingGroupItem = {
  project_working_group_responsibilities: string;
  project_working_group_role: string;
  project_working_group_stakeholders: string[];
};

type WorkingGroup = {
  project_working_group_id: string;
  project_working_group_title: string;
  project_working_group_item: WorkingGroupItem[];
};

type recommendationsStakeholder = {
  project_recommendations_stakeholder_id: string;
  project_recommendations_competencies: string;
  project_recommendations_resources: string;
};

type Project = {
  project_id: string;
  project_name: string;
  project_overview: string;
  project_problem: string;
  project_purpose: string;
  project_scope: string;
  project_link_to_plan: string;
  project_budget: string;
  project_outcomes_and_metrics: OutcomeMetric[];
  project_stakeholders: Stakeholder[];
  project_raci_items: RaciItem[];
  project_working_groups: WorkingGroup[];
  project_documents: string[];
  project_recommendations_general: string;
  project_recommendations_stakeholder: recommendationsStakeholder[];
};

type ProjectContext = {
  project: Project;
  setProject?: Dispatch<SetStateAction<Project>>;
};
