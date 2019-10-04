import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CompanyDataToDisplay, CompanyWithLocation, CompanyMapQueryData } from '../components/admin/admin-interfaces';

const CompaniesQuery = gql`
{
  getCompaniesList {
    _id
    logo
    name
    registrationCountry
    companyType
    motto
    description
    resources {
      ownWebsite {
        resource
        icon
        type
        link
        contentAmount
      }
      socialNetwork {
        resource
        icon
        type
        link
        contentAmount
      }
      info {
        resource
        icon
        type
        link
        contentAmount
      }
      reviews {
        resource
        icon
        type
        link
        contentAmount
      }
    }
  }
}
`;

const CompaniesLocationQuery = (city) => gql`
{
  getParsedCompaniesList(city: "${city}") {
    amount
    companies {
      name
      website
      address {
        city
        street
        lat
        lng
      }
      vacancies {
        _id
        company
        title
        link
        content
        pubDate
      }
      resources {
        link
      }
      icon
    }
  }
}
`;

const CitiesListQuery = () => gql`
{
  getCitiesList {
    city
    lat
    lng
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(public apollo: Apollo) { }

  getCompanies(): Observable<CompanyDataToDisplay[]> {
    return this.apollo.watchQuery<any>({
      query: CompaniesQuery
    }).valueChanges.pipe(map(({ data }) => {
      return data.getCompaniesList;
    }));
  }

  getCompaniesLocation(city: string): Observable<CompanyMapQueryData> {
    return this.apollo.watchQuery<any>({
      query: CompaniesLocationQuery(city)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getParsedCompaniesList;
    }));
  }

  getCitiesList(): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: CitiesListQuery()
    }).valueChanges.pipe(map(({ data }) => {
      return data.getCitiesList;
    }));
  }

}
