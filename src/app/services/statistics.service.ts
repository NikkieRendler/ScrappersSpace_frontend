import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private apollo: Apollo) { }

  getVacancies(dataType): Observable<any> {
    return this.apollo.watchQuery<any>({
      query: dataType
    }).valueChanges.pipe(map(({ data }) => data));
  }

}
