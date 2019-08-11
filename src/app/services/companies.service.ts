import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Resource, CompanyData } from '../components/admin/admin-interfaces';

const CompaniesQuery = gql`
{
  getCompaniesList {
    _id
    name
    logo
    registrationCountry
    companyType
    motto
    description
    resources {
      contentAmount
      link
      resource
      icon
      type
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  constructor(public apollo: Apollo) { }

  getCompanies(): Observable<CompanyData[]> {
    return this.apollo.watchQuery<any>({
      query: CompaniesQuery
    }).valueChanges.pipe(map(({ data }) => {
      return data.getCompaniesList
    }))
  }

}
