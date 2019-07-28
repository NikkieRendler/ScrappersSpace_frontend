import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import gql from 'graphql-tag';
import { BehaviorSubject, Subject } from 'rxjs';
import { Technology } from '../charts/charts-interfaces';


const VacanciesQuery = (technologyType: string) => {
  return gql`{
    getTechnologiesListByType(type: "${technologyType}") {
      technologyName
      numberOfVacancies{
        resource
        totalNumberOfVacancies
      }
      type
    }
  }
  `

}
@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit {

  desiredQueries: string[] = ['programmingLanguage', 'frontend', 'backend', 'database']
  chartDatasets: Technology[][] = [];
  constructor(private service: StatisticsService) { }



  ngOnInit() {
    for (let index = 0; index < this.desiredQueries.length; index++) {
      this.service.getVacancies(VacanciesQuery(this.desiredQueries[index])).subscribe(data => {
        this.chartDatasets.push(data);
      });
    }
  }
}
