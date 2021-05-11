import {Component, Input, OnInit} from '@angular/core';
import {EquipmentService} from '../service/equipment.service';
import {Equipment} from '../model/equipment';
import {ChartComponent} from '../chart/chart.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  operational: any;
  nonOperational: any;

  constructor(public equipmentService: EquipmentService) {
    setTimeout(() => {
      this.operational = this.equipmentService.operational;
      this.nonOperational = this.equipmentService.nonOperational;
    }, 100);
  }

  ngOnInit(): void {

  }
}
