import { Component, OnInit, Input, IterableDiffers, DoCheck } from '@angular/core';
import { Chart, ChartData, Options, Dataset, Technology, TechnologyResourceData, GlobalTechnologyData } from './charts-interfaces';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit, DoCheck {
  iterableDiffer: any = [];
  @Input() chartDatasets: GlobalTechnologyData[] = [];

  datasetsToUse: Technology[] = [];
  charts: Chart[] = [];
  resoucesColors: Array<string> = [
    "rgba(50, 150, 200, .5)",
    "rgba(150, 200, 50, .5)",
    "rgba(60, 160, 90, .5)"
  ]
  type = 'horizontalBar';
  options: Options = {
    title: {
      display: true,
      text: ''
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
  constructor(private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngOnInit() {

  }

  ngDoCheck() {
    if (this.iterableDiffer.diff(this.chartDatasets)) {
      this.chartDatasets.map((dataset, index) => {
        if (!this.datasetsToUse.includes(dataset.data[index])) {
          this.datasetsToUse.push(dataset.data[index]);
          this.createChart(dataset.data, dataset.technologyType, dataset.createdAt)
        }
      })
    }
  }

  createChart = (dataForNewChart: Technology[], technologyType: string, createdAt: string) => {
    console.log("TCL: ChartsComponent -> createChart -> createdAt", new Date(+createdAt ))
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = this.setResourcesNames(dataForNewChart[0].numberOfVacancies);
    const datasetsTemplates = this.setDatasetsTemplates(resourcesNames);
    const options = this.options;
    options.title = this.titleChart(technologyType);
    dataForNewChart.map(technology => {
      data.labels.push(technology.technologyName);
      data.datasets = this.setDatasets(technology, datasetsTemplates);
    });

    this.charts.push({ type: this.type, data: data, options: options, lastUpdate: createdAt });
  }

  setResourcesNames(firstItemResources: TechnologyResourceData[]) {
    return firstItemResources.map(entry => {
      return entry.resource
    });

  }

  setDatasetsTemplates(resourcesNames): Dataset[] {
    let datasetsTemplates: Dataset[] = [];
    for (let index = 0; index < resourcesNames.length; index++) {
      datasetsTemplates.push({ label: resourcesNames[index], data: [], backgroundColor: this.resoucesColors[index] })
    }
    return datasetsTemplates;
  }

  setDatasets(technology: Technology, templates: Dataset[]): Dataset[] {
    technology.numberOfVacancies.forEach(entry => {
      templates[technology.numberOfVacancies.indexOf(entry)].data.push(
        technology.numberOfVacancies[technology.numberOfVacancies.indexOf(entry)].totalNumberOfVacancies
      )
    });
    return templates;
  }

  titleChart(name) {
    return name === 'frontend'
      ? { text: 'Фронтенд технологии', display: true }
      : name === 'programmingLanguage'
        ? { text: 'Языки программирования', display: true }
        : name === 'backend'
          ? { text: 'Бекенд технологии', display: true }
          : name === 'database'
            ? { text: 'Базы данных', display: true }
            : { text: 'Вакансии', display: true }
  }

}
