import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import {EquipmentService} from './service/equipment.service';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

  ],
  providers: [EquipmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
