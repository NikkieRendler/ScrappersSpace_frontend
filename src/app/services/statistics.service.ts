import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { VacanciesQueryData, FreelanceVacanciesQueryData, QueryData, SalariesQueryData } from '../components/charts/charts-interfaces';
import gql from 'graphql-tag';

function VacanciesQuery(technologyType: string) {
  return gql`
  {
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

function RelocateVacanciesQuery(technologyType: string) {
  return gql`
  {
    getRelocateNumberOfVacsByType(technologyType: "${technologyType}") {
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
  return gql`
  {
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

function StartupsVacanciesQuery(technologyType: string) {
  return gql`
  {
    getNumberOfStartupJobsByTechnologyType(technologyType: "${technologyType}"){
      createdAt 
      technologyType
      data {
        technologyName
        total
        numberOfVacancies {
          resource
          totalNumberOfVacancies
        }
      }
    }
  
  }
  `
}
function SalariesQuery(experience: string) {
  return gql`
  {
    getSalaryByExperience(rank: "${experience}") {
      createdAt
      rank
      data {
        technologyName
        total
        salary {
          resource
          amount
        }
      }
    }
  }
  `
}
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

  getRelocateVacancies(dataType): Observable<VacanciesQueryData> {
    return this.apollo.watchQuery<any>({
      query: RelocateVacanciesQuery(dataType)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getRelocateNumberOfVacsByType;
    }));
  }

  getStartupsVacancies(dataType): Observable<VacanciesQueryData> {
    return this.apollo.watchQuery<any>({
      query: StartupsVacanciesQuery(dataType)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getNumberOfStartupJobsByTechnologyType;
    }));
  }

  getSalaries(experience): Observable<SalariesQueryData> {
    return this.apollo.watchQuery<any>({
      query: SalariesQuery(experience)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getSalaryByExperience;
    }));
  }
}
