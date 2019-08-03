import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';

const routes: Routes = [
  {
    path: 'vacancies',
    component: ChartsComponent
  },
  {
    path: 'freelance',
    component: ChartsComponent
  },
  {
    path: '',
    redirectTo: 'vacancies',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
