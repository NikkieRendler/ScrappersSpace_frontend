import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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

  constructor(private service: StatisticsService) { }

  chartDatasets = [];

  ngOnInit() {

    this.service.getVacancies(VacanciesQuery('programmingLanguage')).subscribe(data => {
      if (data) {
        console.log("TCL: StatisticsPageComponent -> ngOnInit -> data", data)
        this.chartDatasets.push(data.getTechnologiesListByType);
      }
    });
    // this.service.getVacancies(VacanciesQuery('frontend')).subscribe(data => {
    //   if (data) {
    //     console.log("TCL: StatisticsPageComponent -> ngOnInit -> data", data)
    //     this.chartDatasets.push(data.getTechnologiesListByType);
    //   }
    // });
  }
}
