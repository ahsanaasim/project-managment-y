// import { type } from "os";

// type WorkingGroupRow = {
//   key: string;
//   role: string;
//   responsibilities: string;
//   stakeholders: string[];
// };

// type WorkingGroupTable = {
//   id: string;
//   name: string;
//   rows: WorkingGroupRow[];
// };

// type OutcomeMetric = {
//   project_metric: string;
//   project_outcome: string;
//   item_id: string;
// };

// type RaciDeliverables = {
//   project_raci_deliverable_id: string;
//   project_recommendations_competencies_raci_responsible: string;
//   project_recommendations_competencies_raci_accountable: string;
//   project_recommendations_competencies_raci_consulted: string;
//   project_recommendations_competencies_raci_informed: string;
// };

// type ProjectRaciDeliverables = {
//   project_raci_deliverable_id: string;
//   project_raci_deliverable_name: string;
//   project_raci_responsible_stakeholder_ids: string[];
//   project_raci_accountable_stakeholder_ids: string[];
//   project_raci_consulted_stakeholder_ids: string[];
//   project_raci_informed_stakeholder_ids: string[];
//   project_raci_responsible_recommendations: string;
//   project_raci_accountable_recommendations: string;
//   project_raci_consulted_recommendations: string;
//   project_raci_informed_recommendations: string;
// };

// type WGItems = {
//   project_wg_id: string;
//   project_recommendations_competencies_wg: string;
// };

// type recommendationsStakeholder = {
//   key: string;
//   project_stakeholder_id: string;
//   // project_recommendations_stakeholder_id: string;
//   // project_recommendations_competencies: string;
//   project_raci_deliverables: RaciDeliverables[];
//   project_wg_items: WGItems[];
//   project_recommendations_resources: string;
// };

// type Stakeholder = {
//   project_stakeholder_email: string;
//   project_stakeholder_id: string;
//   project_stakeholder_name: string;
//   // project_stakeholder_role: string;
//   user_id: string;
//   stakeholder_role_id: string[];
//   project_recommendations_stakeholder: recommendationsStakeholder[];
// };

// type RaciItem = {
//   [key: string]: string | string[];
//   key: string;
//   project_raci_deliverable: string;
//   project_raci_responsible_stakeholder_ids: string[];
//   project_raci_accountable_stakeholder_ids: string[];
//   project_raci_consulted_stakeholder_ids: string[];
//   project_raci_informed_stakeholder_ids: string[];
// };

// type WorkingGroupItem = {
//   key: string;
//   project_working_group_responsibilities: string;
//   project_working_group_role: string;
//   project_working_group_stakeholders: string[];
// };

// type WorkingGroup = {
//   project_working_group_id: string;
//   project_working_group_title: string;
//   project_working_group_item: WorkingGroupItem[];
// };

// type Project = {
//   project_id: string;
//   project_name: string;
//   project_overview: string;
//   project_problem: string;
//   project_purpose: string;
//   project_scope: string;
//   project_link_to_plan: string;
//   project_budget: string;
//   project_outcomes_and_metrics: OutcomeMetric[];
//   project_stakeholders: Stakeholder[];
//   // project_raci_items: RaciItem[];
//   project_raci_deliverables: ProjectRaciDeliverables[];
//   project_working_groups: WorkingGroup[];
//   project_documents: string[];
//   project_recommendations_general: string;
//   // project_recommendations_stakeholder: recommendationsStakeholder[];
// };

type ProjectContext = {
  project: Project;
  setProject?: Dispatch<SetStateAction<Project>>;
};

// // ticket 10

// type Users = {
//   user_id: string;
//   user_name: string;
//   user_email: string;
//   role_id: string[];
//   user_permissions: string;
// };

// type Roles = {
//   role_id: String;
//   role_name: String;
// };

// type Companies = {
//   _id: String;
//   company_name: String;
//   company_admin_email: String;
//   projects: Project[];
//   users: Users[];
//   roles: Roles[];
// };

type ProjectRaciDeliverableStakeholderUpdate = {
  project_stakeholder_id: string;
  project_stakeholder_role: string[];
  project_stakeholder_deliverable_success: number;
  project_stakeholder_deliverable_clarity: number;
  project_stakeholder_deliverable_comment: string;
  project_stakeholder_submitted: boolean;
  project_stakeholder_date_submitted: number;
};

type ProjectStatusUpdateDeliverable = {
  project_raci_deliverable_id: string;
  project_raci_deliverable_stakeholder_update: ProjectRaciDeliverableStakeholderUpdate[];
};

type ProjectWgItem2 = {
  project_wg_id: string;
  project_recommendations_competencies_wg: string;
};

type ProjectRaciDeliverable2 = {
  project_raci_deliverable_id: string;
  project_recommendations_competencies_raci_responsible: string;
  project_recommendations_competencies_raci_accountable: string;
  project_recommendations_competencies_raci_consulted: string;
  project_recommendations_competencies_raci_informed: string;
};

type StatusUpdate = {
  project_status_update_id: string;
  project_status_update_date: string;
  project_status_update_deliverable: ProjectStatusUpdateDeliverable[];
};

type ProjectWgItem1 = {
  key: string; // using key instead of project_wg_item_id
  project_wg_role: string;
  project_wg_responsibilities: string;
  project_wg_stakeholders: string[];
  project_wg_recommendations: string;
};

type ProjectRecommendationsStakeholder = {
  project_stakeholder_id: string;
  project_raci_deliverables: ProjectRaciDeliverable2[];
  project_wg_items: ProjectWgItem2[];
  project_recommendations_resources: string;
};

type ProjectOutcomesAndMetric = {
  project_outcomes_and_metrics_id: string;
  project_metric: string;
  project_outcome: string;
};

type ProjectStakeholder = {
  project_stakeholder_id: string;
  user_id: string;
  stakeholder_role_id: string[];
  project_stakeholder_email: string;
  project_stakeholder_name: string;
  project_recommendations_stakeholder: ProjectRecommendationsStakeholder[];
};

type ProjectRaciDeliverable1 = {
  key: string; // using project_raci_deliverable_id as key
  project_raci_deliverable_name: string;
  project_raci_responsible_stakeholder_ids: string[];
  project_raci_accountable_stakeholder_ids: string[];
  project_raci_consulted_stakeholder_ids: string[];
  project_raci_informed_stakeholder_ids: string[];
  project_raci_responsible_recommendations: string;
  project_raci_accountable_recommendations: string;
  project_raci_consulted_recommendations: string;
  project_raci_informed_recommendations: string;
};

type ProjectWorkingGroup = {
  project_wg_id: string;
  project_wg_title: string;
  project_wg_item: ProjectWgItem1[];
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
  project_outcomes_and_metrics: ProjectOutcomesAndMetric[];
  project_stakeholders: ProjectStakeholder[];
  project_raci_deliverables: ProjectRaciDeliverable1[];
  project_working_groups: ProjectWorkingGroup[];
  project_documents: string[];
  project_recommendations_general: string;
  status_updates: StatusUpdate[];
};

type User = {
  user_id: string;
  user_name: string;
  user_email: string;
  role_id: string[];
  user_permissions: string;
};

type Role = {
  role_id: string;
  role_name: string;
};

type Company = {
  company_id: string;
  company_name: string;
  company_admin_email: string;
  projects: Project[];
  users: User[];
  roles: Role[];
};
