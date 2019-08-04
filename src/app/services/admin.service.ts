import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Resource } from '../components/admin/admin-interfaces';

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
    }).valueChanges.pipe(map(({ data }) => data.getCompanyLinkTypes))
  }

}
