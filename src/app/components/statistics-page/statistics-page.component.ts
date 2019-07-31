import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import gql from 'graphql-tag';
import { Technology, GlobalTechnologyData } from '../charts/charts-interfaces';



@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit {

  desiredQueries: string[] = ['programmingLanguage', 'frontend', 'backend', 'database'];
  chartDatasets: GlobalTechnologyData[] = [];
  constructor(private service: StatisticsService) { }



  ngOnInit() {
    this.desiredQueries.map(query => {
      this.service.getVacancies(query).subscribe(data => {
        this.chartDatasets.push(data);
      });
    });
  }
}
