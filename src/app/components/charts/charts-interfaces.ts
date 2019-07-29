
export interface Chart {
  type: string;
  data: ChartData;
  options: Options;
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
