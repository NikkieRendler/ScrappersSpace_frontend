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

export interface FreelanceVacanciesQueryData {
  technologyType: string;
  createdAt: string;
  data: FreelanceTechnologyJobs[];
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

export interface ChartData {
  labels: Array<string>;
  datasets: Dataset[];
}

export interface Options {
  title: { text: string, display: boolean };
  responsive: boolean;
  maintainAspectRatio: boolean;
  layout: {};
  scales: {};
}

export interface Dataset {
  label: string;
  data: Array<number>;
  backgroundColor: string;
}

export interface Technology {
  technologyName: string;
  numberOfVacancies: Array<TechnologyResourceData>
  technologyType: string;
}

export interface TechnologyResourceData {
  resource: string
  totalNumberOfVacancies: number;
}

