import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'src/app/services/statistics.service';
import { GlobalTechnologyData } from '../charts/charts-interfaces';
import { merge, pipe, of, observable, concat, combineLatest } from 'rxjs';
import { switchMap, mergeMap, concatMap, map, flatMap } from 'rxjs/operators';



@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent implements OnInit {
  observableList = [
    this.service.getVacancies('programmingLanguage'),
    this.service.getVacancies('frontend'),
    this.service.getVacancies('backend'),
    this.service.getVacancies('database')
  ];
  constructor(private service: StatisticsService) { }


  ngOnInit() {
    combineLatest(
      this.service.getVacancies('programmingLanguage'),
      this.service.getVacancies('frontend'),
      this.service.getVacancies('backend'),
      this.service.getVacancies('database'))
      .subscribe(res => {
        res.map(chartData => {
          this.service.chartData.next(chartData);
        });
      });
  }
}
