import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { VacanciesQueryData, FreelanceVacanciesQueryData, QueryData } from '../components/charts/charts-interfaces';
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

function FreelanceVacanciesQuery(technologyType: string) {
  return gql`{
    getNumberOfFreelanceJobsByTechnologyType(technologyType: "${technologyType}") {
      technologyType
      createdAt
      data{
        technologyName
        numberOfJobs
      }
    }
  }
  `;
};
@Injectable({
  providedIn: 'root'
})

export class StatisticsService {

  chartData: Subject<QueryData> = new Subject();


  constructor(private apollo: Apollo) { }

  getVacancies(dataType): Observable<VacanciesQueryData> {
    return this.apollo.watchQuery<any>({
      query: VacanciesQuery(dataType)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getTechnologiesListByType;
    }));
  }

  getFreelanceVacancies(dataType): Observable<FreelanceVacanciesQueryData> {
    return this.apollo.watchQuery<any>({
      query: FreelanceVacanciesQuery(dataType)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getNumberOfFreelanceJobsByTechnologyType;
    }));
  }
}
