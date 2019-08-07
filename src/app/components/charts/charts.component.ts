import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Chart,
  ChartData,
  Options,
  Dataset,
  Technology,
  TechnologyResourceData,
  VacanciesQueryData,
  FreelanceTechnologyJobs,
  FreelanceVacanciesQueryData
} from './charts-interfaces';
import { StatisticsService } from 'src/app/services/statistics.service';
import { pipe, combineLatest } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit, OnDestroy {


  charts: Chart[] = [];
  vacanciesColors: string[] = [
    'rgba(50, 150, 200, .6)',
    'rgba(150, 200, 50, .6)',
    'rgba(60, 160, 90, .6)',
    'rgba(200, 50, 150, .6)'
  ];
  freelanceVacanciesColors: string[] = [
    'rgba(55, 160, 0, 0.6)'
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
  constructor(private service: StatisticsService, public router: Router) {

  }

  ngOnInit() {
    if (this.router.url === "/vacancies") {
      combineLatest(
        this.service.getVacancies('programmingLanguage'),
        this.service.getVacancies('frontend'),
        this.service.getVacancies('backend'),
        this.service.getVacancies('database'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          this.clearChartList();
          data.map(item => {
            setTimeout(() => {
              this.setChartPosition(item);
              this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, item.position);
            }, 100);
          });
        }));
    };
    if (this.router.url === "/relocate") {
      combineLatest(
        this.service.getRelocateVacancies('programmingLanguage'),
        this.service.getRelocateVacancies('frontend'),
        this.service.getRelocateVacancies('backend'),
        this.service.getRelocateVacancies('database'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          this.clearChartList();
          data.map(item => {
            setTimeout(() => {
              this.setChartPosition(item);
              this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, item.position);
            }, 100);
          });
        }));
    };
    if (this.router.url === "/freelance") {
      combineLatest(
        this.service.getFreelanceVacancies('programmingLanguage'),
        this.service.getFreelanceVacancies('frontend'),
        this.service.getFreelanceVacancies('backend'),
        this.service.getFreelanceVacancies('database'))
        .subscribe(pipe((data: FreelanceVacanciesQueryData[]) => {
          this.clearChartList();
          data.map(item => {
            setTimeout(() => {
              this.setChartPosition(item);
              this.createFreelanceVacanciesChart(this.sortFreelanceVacanciesData(item.data), item.technologyType, item.createdAt, item.position);
            }, 100);
          });
        }));
    }
  }

  ngOnDestroy() {
  }

  clearChartList() {
    this.charts.length = 0;
  }

  sortVacanciesData(technologies: Technology[]) {
    return technologies = technologies.sort((techOne, techTwo) => {
      let techTwoOverall = 0;
      techTwo.numberOfVacancies.map(resource => {
        techTwoOverall += resource.totalNumberOfVacancies;
      });
      let techOneOverall = 0;
      techOne.numberOfVacancies.map(resource => {
        techOneOverall += resource.totalNumberOfVacancies;
      });
      return techTwoOverall - techOneOverall;
    });
  }

  sortFreelanceVacanciesData(technologies: FreelanceTechnologyJobs[]) {
    return technologies = technologies.sort((techOne, techTwo) => {
      return techTwo.numberOfJobs - techOne.numberOfJobs;
    })
  }

  createVacanciesChart = (dataForNewChart: Technology[], technologyType: string, createdAt: string, position?: number) => {
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = this.setResourcesNames(dataForNewChart[0].numberOfVacancies);
    const datasetsTemplates = this.setVacanciesDatasetsTemplates(resourcesNames);
    const options = this.options;
    options.title = this.titleChart(technologyType);
    dataForNewChart.map(technology => {
      data.labels.push(decodeURIComponent(technology.technologyName));
      data.datasets = this.setVacanciesDatasets(technology, datasetsTemplates);
    });
    const newChart = { type: this.type, data: data, options: options, lastUpdate: createdAt };
    this.charts.push(newChart)

  }


  createFreelanceVacanciesChart(dataForNewChart: FreelanceTechnologyJobs[], technologyType: string, createdAt: string, position?: number) {
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = ['UpWork'];
    const datasetsTemplates = this.setFreelanceVacanciesDatasetsTemplates(resourcesNames);
    const options = this.options;
    options.title = this.titleChart(technologyType);
    dataForNewChart.map(technology => {
      data.labels.push(decodeURIComponent(technology.technologyName));
    });
    data.datasets = this.setFreelanceVacanciesDatasets(dataForNewChart, datasetsTemplates);
    this.charts.push({ type: this.type, data: data, options: options, lastUpdate: createdAt })
  }

  setResourcesNames(firstItemResources: TechnologyResourceData[]) {
    return firstItemResources.map(entry => {
      return entry.resource;
    });

  }

  setVacanciesDatasetsTemplates(resourcesNames): Dataset[] {
    const datasetsTemplates: Dataset[] = [];
    for (let index = 0; index < resourcesNames.length; index++) {
      datasetsTemplates.push({ label: resourcesNames[index], data: [], backgroundColor: this.vacanciesColors[index] });
    }
    return datasetsTemplates;
  }

  setFreelanceVacanciesDatasetsTemplates(resourcesNames): Dataset[] {
    const datasetsTemplates: Dataset[] = [];
    for (let index = 0; index < resourcesNames.length; index++) {
      datasetsTemplates.push({ label: resourcesNames[index], data: [], backgroundColor: this.freelanceVacanciesColors[index] });
    }
    return datasetsTemplates;
  }

  setVacanciesDatasets(technology: Technology, templates: Dataset[]): Dataset[] {
    technology.numberOfVacancies.forEach(entry => {
      templates[technology.numberOfVacancies.indexOf(entry)].data.push(
        technology.numberOfVacancies[technology.numberOfVacancies.indexOf(entry)].totalNumberOfVacancies
      );
    });
    return templates;
  }

  setFreelanceVacanciesDatasets(technologies: FreelanceTechnologyJobs[], templates: Dataset[]): Dataset[] {
    technologies.map(technology => {
      templates[0].data.push(technology.numberOfJobs);
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
            : { text: 'Вакансии', display: true };
  }

  setChartPosition(chartData: VacanciesQueryData | FreelanceVacanciesQueryData) {
    return chartData.technologyType === 'programmingLanguage'
      ? 0
      : chartData.technologyType === 'frontend'
        ? 1
        : chartData.technologyType === 'backend'
          ? 2
          : 3;
  }
}
