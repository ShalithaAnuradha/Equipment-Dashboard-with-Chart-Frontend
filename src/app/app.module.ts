import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import {EquipmentService} from './service/equipment.service';
import { ChartComponent } from './chart/chart.component';
import { PaginationComponent } from './pagination/pagination.component';
import {AppRoutingModule} from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    ChartComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [EquipmentService],
  bootstrap: [AppComponent]
})
export class AppModule { }
