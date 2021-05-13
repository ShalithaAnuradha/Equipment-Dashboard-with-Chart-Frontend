import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ChartComponent} from './chart/chart.component';
import {MainComponent} from './main/main.component';

const routes: Routes = [
  {path: 'chart', component: ChartComponent},
  {path: 'main', component: MainComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
