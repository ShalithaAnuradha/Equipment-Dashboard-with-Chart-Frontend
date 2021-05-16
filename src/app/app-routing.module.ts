import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ChartComponent} from './chart/chart.component';

const routes: Routes = [
  {path: 'chart', component: ChartComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
