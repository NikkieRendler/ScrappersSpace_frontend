export interface QueryData {
  queryData: VacanciesQueryData[] | FreelanceVacanciesQueryData[];
  kind: string;
}

export interface VacanciesQueryData {
  technologyType: string;
  createdAt: string;
  data: Technology[];
  position?: number;
}

export interface SalariesQueryData {
  rank: string;
  createdAt: string;
  data: TechnologyByExperience[];
  position?: number;
}

export interface FreelanceVacanciesQueryData {
  technologyType: string;
  createdAt: string;
  data: FreelanceTechnologyJobs[];
  position?: number;
}

export interface FreelanceWorkersQueryData {
  technologyType: string;
  createdAt: string;
  data: FreelanceWorkers[];
  position?: number;
}

export interface FreelanceTechnologyJobs {
  technologyName: string;
  numberOfJobs: number;
}

export interface Chart {
  type: string;
  data: ChartData;
  options: Options;
  lastUpdate: string;
}

export interface CommentList {
  comments: Comment[];
  createdAt: string;
  description: string;
  likesCounter: number;
  name: string;
  _id: string;
}

export interface Comment {
  commentBlockId: string;
  text: string;
  username: string;
  _id: string;
}
export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Options {
  title: OptionsTitle;
  responsive: boolean;
  maintainAspectRatio: boolean;
  layout?: {};
  scales: {};
  legend?: {
    labels?: {
      fontSize: number;
    }
  };
}

export interface OptionsTitle {
  text: string;
  display: boolean;
  fontSize?: number;
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface Technology {
  technologyName: string;
  numberOfVacancies: TechnologyResourceData[];
  technologyType: string;
}

export interface FreelanceWorkers {
  technologyName: string;
  numberOfFreelancers: FreelanceWorkersResourceData[];
  total: string;
}

export interface TechnologyResourceData {
  resource: string;
  totalNumberOfVacancies: number;
}

export interface FreelanceWorkersResourceData {
  earnings: string;
  totalNumberOfFreelancers: number;
}

export interface TechnologyByExperience {
  technologyName: string;
  salary: TechnologyByExperienceResourceData[];
  rank: string;
}

export interface TechnologyByExperienceResourceData {
  resource: string;
  amount: number;
}

