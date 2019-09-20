import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular2-chartjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GraphQLModule } from './graphql.module';
import { ChartsComponent } from './components/charts/charts.component';
import { LOCALE_ID } from '@angular/core';
import localeRu from '@angular/common/locales/ru';
import { registerLocaleData } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CompaniesComponent } from './components/companies/companies.component';
import { ChartsDescriptionComponent } from './components/charts/charts-description/charts-description.component';
import { AgmCoreModule } from '@agm/core';


registerLocaleData(localeRu, 'ru');


@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    AdminComponent,
    CompaniesComponent,
    ChartsDescriptionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartModule,
    FlexLayoutModule,
    GraphQLModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCYFI7BioaNm-o-giJv4QJnXMY8tekXAGs'
    })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
