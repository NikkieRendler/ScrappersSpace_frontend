import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import gql from 'graphql-tag';
import { Technology, GlobalTechnologyData } from '../charts/charts-interfaces';


const VacanciesQuery = (technologyType: string) => {
  return gql`{
    getTechnologiesListByType(technologyType: "${technologyType}") {
      technologyType
      createdAt
      data {
        technologyName
        numberOfVacancies{
          resource
          totalNumberOfVacancies
        }
      }
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
  chartDatasets: GlobalTechnologyData[] = [];
  constructor(private service: StatisticsService) { }



  ngOnInit() {
    this.desiredQueries.map((query, index) => {
      this.service.getVacancies(VacanciesQuery(query)).subscribe(data => {
        this.chartDatasets.push(data);
      });
    })
  }
}
