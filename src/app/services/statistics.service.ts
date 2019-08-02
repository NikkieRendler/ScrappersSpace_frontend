import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalTechnologyData } from '../components/charts/charts-interfaces';
import gql from 'graphql-tag';


function VacanciesQuery(technologyType: string) {
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
  `;
};
@Injectable({
  providedIn: 'root'
})

export class StatisticsService {

  chartData: Subject<GlobalTechnologyData> = new Subject();

  constructor(private apollo: Apollo) { }

  getVacancies(dataType): Observable<GlobalTechnologyData> {
    return this.apollo.watchQuery<any>({
      query: VacanciesQuery(dataType)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getTechnologiesListByType;
    }));
  }

}
