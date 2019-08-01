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
  ]
  chartDatasets: GlobalTechnologyData[] = [];
  constructor(private service: StatisticsService) { }


  ngOnInit() {

    // combineLatest(this.service.getVacancies('programmingLanguage'),
    //   this.service.getVacancies('frontend'),
    //   this.service.getVacancies('backend'),
    //   this.service.getVacancies('database'))
    //   .pipe(map(val => of(val)))
    //   .subscribe(val => {
    //     val.subscribe(res => {
    //       res.map(val => {
    //         this.chartDatasets.push(val)
    //       })
    //     })
    //     return
    //   }
    //   )




    merge(
      this.service.getVacancies('programmingLanguage'),
      this.service.getVacancies('frontend'),
      this.service.getVacancies('backend'),
      this.service.getVacancies('database')
    ).pipe(concatMap(val => of(val)))
      .subscribe(val => {
        this.chartDatasets.push(val)
        // console.log("TCL: StatisticsPageComponent -> ngOnInit -> this.chartDatasets", this.chartDatasets)
      })
      



    // this.observableList.map(observable => {
    //   observable
    //     .pipe(mergeMap(val => combineLatest(of(val))))
    //     .subscribe(val => {
    //       console.log("TCL: StatisticsPageComponent -> ngOnInit -> val", val)
    //       return this.chartDatasets.push(val[0])
    //     })
    // })

    // this.service.getVacancies('frontend')
    //   .pipe(concatMap(val => of(val)))
    //   .subscribe(val => console.log(val)
    //   )
  }
}
