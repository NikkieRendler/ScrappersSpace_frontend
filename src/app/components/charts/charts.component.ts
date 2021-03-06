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
  FreelanceWorkersResourceData,
  Comment,
  CommentList
} from './charts-interfaces';
import { StatisticsService } from 'src/app/services/statistics.service';
import { pipe, combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { distanceInWords } from 'date-fns';
import { CommentsService } from 'src/app/services/comments.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent implements OnInit, OnDestroy {
  currentRoute: string;
  chartsLoading = true;
  commentsLoading = true;
  freelanceWorkersCommentsLoading = true;
  freelanceWorkersLoading = true;
  time = distanceInWords(new Date(), new Date());

  charts: Chart[] = [null, null, null];
  freelanceWorkersCharts: Chart[] = [null, null, null];
  comments: Comment[][] = [null, null, null];
  freelanceWorkersComments: Comment[][] = [null, null, null];
  commentsFormsArray: FormArray;
  freelanceWorkersCommentsFormsArray: FormArray;
  vacanciesColors: string[] = [
    'rgba(50, 150, 200, .6)',
    'rgba(150, 200, 50, .6)',
    'rgba(60, 160, 90, .6)',
    'rgba(255, 141, 92, .6)',
    'rgba(255, 202, 87, .6)'
  ];
  freelanceVacanciesColors: string[] = [
    'rgba(55, 160, 0, 0.6)'
  ];
  type = 'horizontalBar';
  constructor(
    private statisticsService: StatisticsService,
    private commentsService: CommentsService,
    private fb: FormBuilder,
    public router: Router) {

  }

  ngOnInit() {
    this.commentsFormsArray = this.fb.array([]);
    this.freelanceWorkersCommentsFormsArray = this.fb.array([]);

    this.currentRoute = this.router.url;
    if (this.router.url === '/vacancies') {
      combineLatest(
        this.statisticsService.getVacancies('programmingLanguage'),
        this.statisticsService.getVacancies('frontend'),
        this.statisticsService.getVacancies('backend'),
        this.statisticsService.getVacancies('database'),
        this.statisticsService.getVacancies('other'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          data.map(item => {
            this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, this.setChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
      combineLatest(
        this.commentsService.getComments('general-vacancies-programmingLanguage'),
        this.commentsService.getComments('general-vacancies-frontend'),
        this.commentsService.getComments('general-vacancies-backend'),
        this.commentsService.getComments('general-vacancies-database'),
        this.commentsService.getComments('general-vacancies-other')
      ).subscribe(pipe((data: CommentList[]) => {
        data.map((item, index) => {
          this.setComments(item, index);
          this.displayCommentsOnLoad();
        });
      }));
    }
    if (this.router.url === '/relocate') {
      combineLatest(
        this.statisticsService.getRelocateVacancies('programmingLanguage'),
        this.statisticsService.getRelocateVacancies('frontend'),
        this.statisticsService.getRelocateVacancies('backend'),
        this.statisticsService.getRelocateVacancies('database'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          data.map(item => {
            this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, this.setChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
      combineLatest(
        this.commentsService.getComments('relocate-general'),
        this.commentsService.getComments('relocate-frontend'),
        this.commentsService.getComments('relocate-backend'),
        this.commentsService.getComments('relocate-database')
      ).subscribe(pipe((data: CommentList[]) => {
        data.map((item, index) => {
          this.setComments(item, index);
          this.displayCommentsOnLoad();
        });
      }));
    }
    if (this.router.url === '/freelance') {
      combineLatest(
        this.statisticsService.getFreelanceVacancies('programmingLanguage'),
        this.statisticsService.getFreelanceVacancies('frontend'),
        this.statisticsService.getFreelanceVacancies('backend'),
        this.statisticsService.getFreelanceVacancies('database'))
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
        this.statisticsService.getFreelanceWorkers('programmingLanguage'),
        this.statisticsService.getFreelanceWorkers('frontend'),
        this.statisticsService.getFreelanceWorkers('backend'),
        this.statisticsService.getFreelanceWorkers('database'))
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
      combineLatest(
        this.commentsService.getComments('freelance-jobs-general'),
        this.commentsService.getComments('freelance-jobs-frontend'),
        this.commentsService.getComments('freelance-jobs-backend'),
        this.commentsService.getComments('freelance-jobs-database')
      ).subscribe(pipe((data: CommentList[]) => {
        data.map((item, index) => {
          this.setComments(item, index);
          this.displayCommentsOnLoad();
        });
      }));
      combineLatest(
        this.commentsService.getComments('freelance-freelancers-general'),
        this.commentsService.getComments('freelance-freelancers-frontend'),
        this.commentsService.getComments('freelance-freelancers-backend'),
        this.commentsService.getComments('freelance-freelancers-database')
      ).subscribe(pipe((data: CommentList[]) => {
        data.map((item, index) => {
          this.setFreelanceWorkersComments(item, index);
          this.displayFreelanceWorkersCommentsOnLoad();
        });
      }));
    }
    if (this.router.url === '/startups') {
      combineLatest(
        this.statisticsService.getStartupsVacancies('programmingLanguage'),
        this.statisticsService.getStartupsVacancies('frontend'),
        this.statisticsService.getStartupsVacancies('backend'),
        this.statisticsService.getStartupsVacancies('database'))
        .subscribe(pipe((data: VacanciesQueryData[]) => {
          data.map(item => {
            this.createVacanciesChart(this.sortVacanciesData(item.data), item.technologyType, item.createdAt, this.setChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
      combineLatest(
        this.commentsService.getComments('startup-general'),
        this.commentsService.getComments('startup-frontend'),
        this.commentsService.getComments('startup-backend'),
        this.commentsService.getComments('startup-database')
      ).subscribe(pipe((data: CommentList[]) => {
        data.map((item, index) => {
          this.setComments(item, index);
          this.displayCommentsOnLoad();
        });
      }));
    }
    if (this.router.url === '/salaries') {
      combineLatest(
        this.statisticsService.getSalaries('Junior Software Engineer'),
        this.statisticsService.getSalaries('Software Engineer'),
        this.statisticsService.getSalaries('Senior Software Engineer'))
        .subscribe(pipe((data: SalariesQueryData[]) => {
          data.map(item => {
            this.createSalariesChart(this.sortSalariesData(item.data), item.rank, item.createdAt, this.setSalariesChartPosition(item));
            this.displayChartsOnLoad();
          });
        }));
      combineLatest(
        this.commentsService.getComments('salaries-junior'),
        this.commentsService.getComments('salaries-middle'),
        this.commentsService.getComments('salaries-senior'),
      ).subscribe(pipe((data: CommentList[]) => {
        data.map((item, index) => {
          this.setComments(item, index);
          this.displayCommentsOnLoad();
        });
      }));
    }
  }

  submitForm(form, position) {
    this.commentsService.addComment(form).subscribe((res) => {
      this.addCommentOnResponse(res, position);
    });
    this.toggleCommentForm(position);
  }

  addCommentOnResponse(commentFromResponse, position) {
    const addedComment: Comment = {
      text: commentFromResponse.data.addComment.text,
      username: commentFromResponse.data.addComment.username,
      commentBlockId: commentFromResponse.data.addComment.commentBlockId,
      _id: commentFromResponse.data.addComment._id
    };
    this.comments[position].push(addedComment);
  }

  submitFreelanceWorkersForm(form, position) {
    this.commentsService.addComment(form).subscribe((res) => {
      this.addFreelanceWorkersCommentOnResponse(res, position);
    });
    this.toggleFreelanceWorkersCommentForm(position);
  }

  addFreelanceWorkersCommentOnResponse(commentFromResponse, position) {
    const addedComment: Comment = {
      text: commentFromResponse.data.addComment.text,
      username: commentFromResponse.data.addComment.username,
      commentBlockId: commentFromResponse.data.addComment.commentBlockId,
      _id: commentFromResponse.data.addComment._id
    };
    this.freelanceWorkersComments[position].push(addedComment);
  }

  toggleCommentForm(position) {
    this.commentsFormsArray.controls[position].setValue({
      commentBlockId: this.commentsFormsArray.controls[position].value.commentBlockId,
      text: null,
      username: 'anon',
      visible: !this.commentsFormsArray.controls[position].value.visible
    });
  }

  toggleFreelanceWorkersCommentForm(position) {
    this.freelanceWorkersCommentsFormsArray.controls[position].setValue({
      commentBlockId: this.freelanceWorkersCommentsFormsArray.controls[position].value.commentBlockId,
      text: null,
      username: 'anon',
      visible: !this.freelanceWorkersCommentsFormsArray.controls[position].value.visible
    });
  }

  getCommentSectionHeight(position): string {
    const formState = this.commentsFormsArray.controls[position].value.visible;
    return this.currentRoute === '/salaries' && formState
      ? 'salariesRouteComments'
      : this.currentRoute === '/salaries' && !formState
        ? 'salariesRouteCommentsNoForm'
        : this.currentRoute !== '/salaries' && formState
          ? 'vacanciesRouteComments'
          : this.currentRoute !== '/salaries' && !formState
            ? 'vacanciesRouteCommentsNoForm'
            : '';
  }

  ngOnDestroy() {
  }

  displayChartsOnLoad() {
    if (!this.charts.some(chart => chart === null)) {
      this.chartsLoading = false;
    }
  }

  displayFreelanceWorkersChartsOnLoad() {
    if (!this.freelanceWorkersCharts.some(chart => chart === null)) {
      this.freelanceWorkersLoading = false;
    }
  }

  displayCommentsOnLoad() {
    if (!this.comments.some(comment => comment === null)) {
      this.commentsLoading = false;
    }
  }

  displayFreelanceWorkersCommentsOnLoad() {
    if (!this.freelanceWorkersComments.some(comment => comment === null)) {
      this.freelanceWorkersCommentsLoading = false;
    }
  }

  setComments(item: CommentList, index) {
    this.comments.splice(index, 1, item.comments);
    this.addCommentsForm(item);
  }

  setFreelanceWorkersComments(item: CommentList, index) {
    this.freelanceWorkersComments.splice(index, 1, item.comments);
    this.addFreelanceWorkersCommentsForm(item);
  }

  addCommentsForm(commentList: CommentList) {
    const newCommentsForm = this.fb.group({
      username: [null, Validators.required],
      text: [null, Validators.required],
      commentBlockId: [commentList._id],
      visible: [false]
    });
    this.commentsFormsArray.push(newCommentsForm);
  }

  addFreelanceWorkersCommentsForm(commentList: CommentList) {
    const newCommentsForm = this.fb.group({
      username: [null, Validators.required],
      text: [null, Validators.required],
      commentBlockId: [commentList._id],
      visible: [false]
    });
    this.freelanceWorkersCommentsFormsArray.push(newCommentsForm);
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
    const options = this.setFreelanceWorkersOptions(technologyType);
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
      return entry.earnings === 'atLeastOneDollar'
        ? '$1+'
        : entry.earnings === 'atLeastHundreedDollars'
          ? '$100+'
          : entry.earnings === 'atLeastThousandDollars'
            ? '$1000+'
            : entry.earnings === 'atLeastTenThousandsDollars'
              ? '$10000+'
              : 'Без заработка';
    });
  }

  setOptions(technologyType) {
    const options: Options = {
      title: this.titleChart(technologyType),
      responsive: true,
      maintainAspectRatio: false,
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

  setFreelanceWorkersOptions(technologyType) {
    const options: Options = {
      title: this.titleFreelanceWorkersChart(technologyType),
      responsive: true,
      maintainAspectRatio: false,
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
    if (this.currentRoute === '/vacancies') {
      return name === 'frontend'
        ? { text: 'Количество вакансий по фронтенд технологиям', display: true, fontSize: 15 }
        : name === 'programmingLanguage'
          ? { text: 'Количество вакансий по языкам программирования', display: true, fontSize: 15 }
          : name === 'backend'
            ? { text: 'Количество вакансий по бекенд технологиям', display: true, fontSize: 15 }
            : name === 'database'
              ? { text: 'Количество вакансий по базам данных', display: true, fontSize: 15 }
              : name === 'other'
                ? { text: 'Количество вакансий по другим специальностям', display: true, fontSize: 15 }
                : { text: name, display: true, fontSize: 15 };
    }
    if (this.currentRoute === '/salaries') {
      return name === 'Junior Software Engineer'
        ? { text: 'Зарплаты junior специалистов по языкам программирования', display: true, fontSize: 15 }
        : name === 'Software Engineer'
          ? { text: 'Зарплаты middle специалистов по языкам программирования', display: true, fontSize: 15 }
          : name === 'Senior Software Engineer'
            ? { text: 'Зарплаты senior специалистов по языкам программирования', display: true, fontSize: 15 }
            : { text: name, display: true, fontSize: 15 }
    }
    if (this.currentRoute === '/freelance') {
      return name === 'frontend'
        ? { text: 'Количество вакансий по фронтенд технологиям на фрилансе', display: true, fontSize: 15 }
        : name === 'programmingLanguage'
          ? { text: 'Количество вакансий по языкам программирования на фрилансе', display: true, fontSize: 15 }
          : name === 'backend'
            ? { text: 'Количество вакансий по бекенд технологиям на фрилансе', display: true, fontSize: 15 }
            : name === 'database'
              ? { text: 'Количество вакансий по базам данных на фрилансе', display: true, fontSize: 15 }
              : name === 'other'
                ? { text: 'Количество вакансий по другим специальностям на фрилансе', display: true, fontSize: 15 }
                : { text: name, display: true, fontSize: 15 };
    }
    if (this.currentRoute === '/relocate') {
      return name === 'frontend'
        ? { text: 'Количество вакансий по фронтенд технологиям для релокейта', display: true, fontSize: 15 }
        : name === 'programmingLanguage'
          ? { text: 'Количество вакансий по языкам программирования для релокейта', display: true, fontSize: 15 }
          : name === 'backend'
            ? { text: 'Количество вакансий по бекенд технологиям для релокейта', display: true, fontSize: 15 }
            : name === 'database'
              ? { text: 'Количество вакансий по базам данных для релокейта', display: true, fontSize: 15 }
              : { text: name, display: true, fontSize: 15 };
    }
    if (this.currentRoute === '/startups') {
      return name === 'frontend'
        ? { text: 'Количество вакансий по фронтенд технологиям для стартапов', display: true, fontSize: 15 }
        : name === 'programmingLanguage'
          ? { text: 'Количество вакансий по языкам программирования для стартапов', display: true, fontSize: 15 }
          : name === 'backend'
            ? { text: 'Количество вакансий по бекенд технологиям для стартапов', display: true, fontSize: 15 }
            : name === 'database'
              ? { text: 'Количество вакансий по базам данных для стартапов', display: true, fontSize: 15 }
              : { text: name, display: true, fontSize: 15 };
    }
  }

  titleFreelanceWorkersChart(name: string): OptionsTitle {
    return name === 'frontend'
      ? { text: 'Количество фрилансеров по фронтенд технологиям', display: true, fontSize: 15 }
      : name === 'programmingLanguage'
        ? { text: 'Количество фрилансеров по языкам программирования', display: true, fontSize: 15 }
        : name === 'backend'
          ? { text: 'Количество фрилансеров по бекенд технологиям', display: true, fontSize: 15 }
          : name === 'database'
            ? { text: 'Количество фрилансеров по базам данных', display: true, fontSize: 15 }
            : name === 'other'
              ? { text: 'Количество фрилансеров по другим специальностям', display: true, fontSize: 15 }
              : { text: name, display: true, fontSize: 15 };
  }

  setChartPosition(chartData: VacanciesQueryData | FreelanceVacanciesQueryData | FreelanceWorkersQueryData) {
    return chartData.technologyType === 'programmingLanguage'
      ? 0
      : chartData.technologyType === 'frontend'
        ? 1
        : chartData.technologyType === 'backend'
          ? 2
          : chartData.technologyType === 'database'
            ? 3
            : 4;
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
