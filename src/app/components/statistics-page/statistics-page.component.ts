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
      technologyType
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
    this.desiredQueries.map((data, index) => {
      this.service.getVacancies(VacanciesQuery(this.desiredQueries[index])).subscribe(data => {
        const mappedData = data.filter(item => item.technologyType === this.desiredQueries[index]);
        this.chartDatasets.push(mappedData);
      });
    })
  }
}
