import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Resource } from '../components/admin/admin-interfaces';
import { CompanyData } from '../components/admin/admin-interfaces';



const CompanyMutationQuery = gql`
mutation ($name: String!, $registrationCountry: String,
  $companyType: String, $motto: String, $description: String, $resources: [inputResource!]) {
  addCompany(
    name: $name,
    registrationCountry: $registrationCountry,
    companyType: $companyType,
    motto: $motto,
    description: $description,
    resources: $resources
  )
  {
    registrationCountry
    companyType
    motto
    description
  }
}`;


const adminCompanyResources = gql`{
  getCompanyLinkTypes {
    resource
    icon
    type
    _id
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apollo: Apollo) { }

  getResources(): Observable<Resource[]> {
    return this.apollo.watchQuery<any>({
      query: adminCompanyResources
    }).valueChanges.pipe(map(({ data }) => data.getCompanyLinkTypes));
  }

  addCompany(companyData: CompanyData): Observable<CompanyData> {
    console.log("TCL: companyData", companyData);
    return this.apollo.mutate({
      mutation: CompanyMutationQuery,
      variables: {
        name: companyData.name,
        registrationCountry: companyData.registrationCountry,
        companyType: companyData.companyType,
        motto: companyData.motto,
        description: companyData.description,
        resources: companyData.resources
      }
    });
  }

}
