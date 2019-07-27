import { Component, OnInit, Input } from '@angular/core';

interface Chart {
  type: string;
  data: ChartData;
  options: Options;
}

interface ChartData {
  labels: Array<string>;
  datasets: Dataset[];
}

interface Options {
  title: { text: string, display: boolean };
  responsive: boolean;
  maintainAspectRatio: boolean;
  layout: {};
  scales: {};
}

interface Dataset {
  label: string;
  data: Array<number>;
  backgroundColor: string;
}

interface Technology {
  technologyName: string;
  numberOfVacancies: Array<TechnologyResourceData>
  type: string;
}

interface TechnologyResourceData {
  resource: string
  totalNumberOfVacancies: number;
}


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit {
  @Input('chartDatasets') set _chartDatasets(data: Array<Technology[]>) {
    if (data) {
      this.setStatistics(data[0]);
    }

  };

  charts: Chart[] = [];

  resources: Array<string> = [];
  resoucesColors: Array<string> = [
    "rgba(50, 150, 200, .5)",
    "rgba(150, 200, 50, .5)",
    "rgba(60, 160, 90, .5)"
  ]

  type = 'horizontalBar';
  data: ChartData = {
    labels: [],
    datasets: []
  };
  options: Options = {
    title: {
      display: true,
      text: 'Вакансии'
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 50,
        right: 50,
        top: 0,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true
        },
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    }
  };
  constructor() { }

  ngOnInit() {

  }

  setStatistics(dataForNewChart: Technology[]) {
    this.resources.length = 0;
    this.data.labels.length = 0;
    this.data.datasets.length = 0;
    this.setResourcesNames(dataForNewChart[0].numberOfVacancies);
    this.setDatasetsTemplates();
    dataForNewChart.map(technology => {
      this.setLabel(technology);
      this.setDatasets(technology);
    });
    this.titleChart(dataForNewChart[0].type[0])
    this.charts.push({ type: this.type, data: this.data, options: this.options });
    console.log(this.charts);

  }

  setResourcesNames(firstItemResources) {
    firstItemResources.map(entry => {
      this.resources.push(entry.resource);
    });
  }

  setDatasetsTemplates() {
    for (let index = 0; index < this.resources.length; index++) {
      this.data.datasets.push({ label: this.resources[index], data: [], backgroundColor: this.resoucesColors[index] })
    }
  }

  setLabel(technology) {
    this.data.labels.push(technology.technologyName);
  }

  setDatasets(technology) {
    technology.numberOfVacancies.forEach(entry => {
      this.data.datasets[technology.numberOfVacancies.indexOf(entry)].data.push(
        technology.numberOfVacancies[technology.numberOfVacancies.indexOf(entry)].totalNumberOfVacancies
      )
    })
  }

  titleChart(name) {
    name === 'frontend'
      ? this.options.title = { text: 'Фронтенд технологии', display: true }
      : name === 'programmingLanguage'
        ? this.options.title = { text: 'Языки программирования', display: true }
        : this.options.title = { text: 'Вакансии', display: true }

  }
}
