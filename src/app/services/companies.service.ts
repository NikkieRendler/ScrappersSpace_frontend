import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CompanyDataToDisplay, CompanyWithLocation } from '../components/admin/admin-interfaces';

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
    name
    address {
      city
      street
      lat
      lng
    }
    resources {
      link
    }
    icon
  }
}
`

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

  getCompaniesLocation(city): Observable<CompanyWithLocation[]> {
    return this.apollo.watchQuery<any>({
      query: CompaniesLocationQuery(city)
    }).valueChanges.pipe(map(({ data }) => {
      return data.getParsedCompaniesList;
    }));
  }

}
