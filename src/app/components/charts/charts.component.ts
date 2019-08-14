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
  FreelanceVacanciesQueryData,
  TechnologyByExperience,
  TechnologyByExperienceResourceData,
  SalariesQueryData,
  OptionsTitle,
  FreelanceWorkersQueryData,
  FreelanceWorkers,
  FreelanceWorkersResourceData
} from './charts-interfaces';
import { StatisticsService } from 'src/app/services/statistics.service';
import { pipe, combineLatest, concat, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { distanceInWords } from 'date-fns';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit, OnDestroy {
  currentRoute: string;
  loading = true;
  freelanceWorkersLoading = true;
  time = distanceInWords(new Date(), new Date());

  charts: Chart[] = [null, null, null];
  freelanceWorkersCharts: Chart[] = [null, null, null];
  vacanciesColors: string[] = [
    'rgba(50, 150, 200, .6)',
    'rgba(150, 200, 50, .6)',
    'rgba(60, 160, 90, .6)',
    'rgba(200, 50, 150, .6)'
  ];
  freelanceVacanciesColors: string[] = [
    'rgba(55, 160, 0, 0.6)'
  ];
  type = 'horizontalBar';
  constructor(private service: StatisticsService, public router: Router) {

  }

  ngOnInit() {
    this.currentRoute = this.router.url;
    if (this.router.url === '/vacancies') {
      combineLatest(
        this.service.getVacancies('programmingLanguage'),
        this.service.getVacancies('frontend'),
        this.service.getVacancies('backend'),
        this.service.getVacancies('database'),
        this.service.getVacancies('other'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          data.map(item => {
            this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, this.setChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
    }
    if (this.router.url === '/relocate') {
      combineLatest(
        this.service.getRelocateVacancies('programmingLanguage'),
        this.service.getRelocateVacancies('frontend'),
        this.service.getRelocateVacancies('backend'),
        this.service.getRelocateVacancies('database'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          data.map(item => {
            this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, this.setChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
    }
    if (this.router.url === '/freelance') {
      combineLatest(
        this.service.getFreelanceVacancies('programmingLanguage'),
        this.service.getFreelanceVacancies('frontend'),
        this.service.getFreelanceVacancies('backend'),
        this.service.getFreelanceVacancies('database'))
        .subscribe(pipe(
          (data: FreelanceVacanciesQueryData[]) => {
            data.map(item => {
              this.createFreelanceVacanciesChart(
                this.sortFreelanceVacanciesData(item.data),
                item.technologyType,
                item.createdAt,
                this.setChartPosition(item));
              this.displayChartsOnLoad();
            });
          }));
      combineLatest(
        this.service.getFreelanceWorkers('programmingLanguage'),
        this.service.getFreelanceWorkers('frontend'),
        this.service.getFreelanceWorkers('backend'),
        this.service.getFreelanceWorkers('database'))
        .subscribe(pipe(
          (data: FreelanceWorkersQueryData[]) => {
            data.map(item => {
              this.createFreelanceWorkersChart(
                this.sortFreelanceWorkersData(item.data),
                item.technologyType,
                item.createdAt,
                this.setChartPosition(item));
              this.displayFreelanceWorkersChartsOnLoad();
            });
          }));
    }
    if (this.router.url === '/startups') {
      combineLatest(
        this.service.getStartupsVacancies('programmingLanguage'),
        this.service.getStartupsVacancies('frontend'),
        this.service.getStartupsVacancies('backend'),
        this.service.getStartupsVacancies('database'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          data.map(item => {
            this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, this.setChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
    }
    if (this.router.url === '/salaries') {
      combineLatest(
        this.service.getSalaries('Junior Software Engineer'),
        this.service.getSalaries('Software Engineer'),
        this.service.getSalaries('Senior Software Engineer'))
        .subscribe(pipe((data: SalariesQueryData[]) => {
          data.map(item => {
            this.createSalariesChart(this.sortSalariesData(item.data), item.rank, item.createdAt, this.setSalariesChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
    }
  }

  ngOnDestroy() {
  }

  displayChartsOnLoad() {
    if (!this.charts.some(chart => chart === null)) {
      this.loading = false;
    }
  }

  displayFreelanceWorkersChartsOnLoad() {
    if (!this.freelanceWorkersCharts.some(chart => chart === null)) {
      this.freelanceWorkersLoading = false;
    }
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

  sortSalariesData(technologies: TechnologyByExperience[]) {
    return technologies = technologies.sort((techOne, techTwo) => {
      let techTwoAverage = 0;
      const techTwoNonZeroResources = techTwo.salary.filter(resource => resource.amount !== 0);
      techTwoNonZeroResources.map(resource => {
        techTwoAverage += resource.amount;
      });
      techTwoAverage = techTwoAverage / techTwoNonZeroResources.length;

      let techOneAverage = 0;
      const techOneNonZeroResources = techOne.salary.filter(resource => resource.amount !== 0);
      techOneNonZeroResources.map(resource => {
        techOneAverage += resource.amount;
      });
      techOneAverage = techOneAverage / techOneNonZeroResources.length;
      return techTwoAverage - techOneAverage;
    });
  }

  sortFreelanceVacanciesData(technologies: FreelanceTechnologyJobs[]) {
    return technologies = technologies.sort((techOne, techTwo) => {
      return techTwo.numberOfJobs - techOne.numberOfJobs;
    });
  }

  sortFreelanceWorkersData(technologies: FreelanceWorkers[]) {
    return technologies.sort((techOne, techTwo) => {
      return +techTwo.total - +techOne.total;
    });
  }

  createVacanciesChart = (dataForNewChart: Technology[], technologyType: string, createdAt: string, position?: number) => {
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = this.setResourcesNames(dataForNewChart[0].numberOfVacancies);
    const datasetsTemplates = this.setVacanciesDatasetsTemplates(resourcesNames);
    const options = this.setOptions(technologyType);
    dataForNewChart.map(technology => {
      data.labels.push(decodeURIComponent(technology.technologyName));
      data.datasets = this.setVacanciesDatasets(technology, datasetsTemplates);
    });
    const newChart = { type: this.type, data, options, lastUpdate: createdAt };
    this.charts.splice(position, 1, newChart);
  }

  createSalariesChart = (dataForNewChart: TechnologyByExperience[], rank: string, createdAt: string, position?: number) => {
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = this.setSalariesResourcesNames(dataForNewChart[0].salary);
    const datasetsTemplates = this.setVacanciesDatasetsTemplates(resourcesNames);
    const options = this.setSalariesOptions(rank);
    dataForNewChart.map(technology => {
      if (!technology.salary.some(resource => resource.amount === 0)) {
        data.labels.push(decodeURIComponent(technology.technologyName));
        data.datasets = this.setSalariesDatasets(technology, datasetsTemplates);
      }
    });
    const newChart = { type: this.type, data, options, lastUpdate: createdAt };
    this.charts.splice(position, 1, newChart);
  }

  createFreelanceVacanciesChart(dataForNewChart: FreelanceTechnologyJobs[], technologyType: string, createdAt: string, position?: number) {
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = ['upwork.com'];
    const datasetsTemplates = this.setFreelanceVacanciesDatasetsTemplates(resourcesNames);
    const options = this.setOptions(technologyType);
    dataForNewChart.map(technology => {
      data.labels.push(decodeURIComponent(technology.technologyName));
      data.datasets = this.setFreelanceVacanciesDatasets(dataForNewChart, datasetsTemplates);
    });
    const newChart = { type: this.type, data, options, lastUpdate: createdAt };
    this.charts.splice(position, 1, newChart);
  }

  createFreelanceWorkersChart = (dataForNewChart: FreelanceWorkers[], technologyType: string, createdAt: string, position?: number) => {
    const data: ChartData = { labels: [], datasets: [] };
    const resourcesNames: string[] = this.setFreelanceWorkersResourcesNames(dataForNewChart[0].numberOfFreelancers);
    const datasetsTemplates = this.setVacanciesDatasetsTemplates(resourcesNames);
    const options = this.setOptions(technologyType);
    dataForNewChart.map(technology => {
      data.labels.push(decodeURIComponent(technology.technologyName));
      data.datasets = this.setFreelanceWorkersDatasets(technology, datasetsTemplates);
    });
    const newChart = { type: this.type, data, options, lastUpdate: createdAt };
    this.freelanceWorkersCharts.splice(position, 1, newChart);
  }

  setResourcesNames(firstItemResources: TechnologyResourceData[]): string[] {
    return firstItemResources.map(entry => {
      return entry.resource;
    });
  }


  setSalariesResourcesNames(firstItemResources: TechnologyByExperienceResourceData[]): string[] {
    return firstItemResources.map(entry => {
      return entry.resource;
    });
  }

  setFreelanceWorkersResourcesNames(firstItemResources: FreelanceWorkersResourceData[]): string[] {
    return firstItemResources.map(entry => {
      return entry.earnings === 'atLeastOneDollar' ? 'C заработком' : 'Без заработка';
    });
  }

  setOptions(technologyType) {
    const options: Options = {
      title: this.titleChart(technologyType),
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 0,
          bottom: 0
        }
      },
      legend: {
        labels: {
          fontSize: 14
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
    return options;
  }

  setSalariesOptions(rank) {
    const options: Options = {
      title: this.titleChart(rank),
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 0,
          bottom: 0
        }
      },
      legend: {
        labels: {
          fontSize: 14
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true
          },
        }],
      }
    };
    return options;
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

  setSalariesDatasets(technology: TechnologyByExperience, templates: Dataset[]): Dataset[] {
    technology.salary.forEach(entry => {
      templates[technology.salary.indexOf(entry)].data.push(
        technology.salary[technology.salary.indexOf(entry)].amount
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

  setFreelanceWorkersDatasets(technology: FreelanceWorkers, templates: Dataset[]): Dataset[] {
    technology.numberOfFreelancers.forEach(entry => {
      templates[technology.numberOfFreelancers.indexOf(entry)].data.push(
        technology.numberOfFreelancers[technology.numberOfFreelancers.indexOf(entry)].totalNumberOfFreelancers
      );
    });
    return templates;
  }

  titleChart(name: string): OptionsTitle {
    return name === 'frontend'
      ? { text: 'Фронтенд технологии', display: true, fontSize: 15 }
      : name === 'programmingLanguage'
        ? { text: 'Языки программирования', display: true, fontSize: 15 }
        : name === 'backend'
          ? { text: 'Бекенд технологии', display: true, fontSize: 15 }
          : name === 'database'
            ? { text: 'Базы данных', display: true, fontSize: 15 }
            : name === 'Software Engineer'
              ? { text: 'Middle Software Engineer', display: true, fontSize: 15 }
              : name === 'other'
                ? { text: 'Другое', display: true, fontSize: 15 }
                : { text: name, display: true, fontSize: 15 };
  }

  setChartPosition(chartData: VacanciesQueryData | FreelanceVacanciesQueryData | FreelanceWorkersQueryData) {
    return chartData.technologyType === 'programmingLanguage'
      ? 0
      : chartData.technologyType === 'frontend'
        ? 1
        : chartData.technologyType === 'backend'
          ? 2
          : 3;
  }

  setSalariesChartPosition(chartData: SalariesQueryData) {
    return chartData.rank === 'Junior Software Engineer'
      ? 0
      : chartData.rank === 'Software Engineer'
        ? 1
        : chartData.rank === 'Senior Software Engineer'
          ? 2
          : 3;
  }
}
