import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsPageComponent } from './components/statistics-page/statistics-page.component';

const routes: Routes = [
  {
    path: 'statistics',
    component: StatisticsPageComponent
  },
  {
    path: '',
    redirectTo: 'statistics',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
