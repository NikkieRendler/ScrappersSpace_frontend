import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatisticsComponent } from './components/statistics/statistics.component';

const routes: Routes = [
  {
    path: 'statistics',
    component: StatisticsComponent
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
