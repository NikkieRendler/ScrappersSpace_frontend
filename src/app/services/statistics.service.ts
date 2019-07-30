import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalTechnologyData } from '../components/charts/charts-interfaces';



@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private apollo: Apollo) { }

  getVacancies(dataType): Observable<GlobalTechnologyData> {
    return this.apollo.watchQuery<any>({
      query: dataType
    }).valueChanges.pipe(map(({ data }) => data.getTechnologiesListByType));
  }

}
