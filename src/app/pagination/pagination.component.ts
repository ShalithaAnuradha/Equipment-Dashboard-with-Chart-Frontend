import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {EquipmentService} from '../service/equipment.service';
import {ChartComponent} from '../chart/chart.component';

@Component({
  providers: [ChartComponent],
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  previousDisabled = true;
  nextDisabled = false;
  previousColor = 'grey';
  nextColor = 'dodgerblue';

  @Output() chartEvent = new EventEmitter();

  constructor(public equipmentService: EquipmentService, public chart: ChartComponent) { }

  ngOnInit(): void {
  }

  next(): void {
    this.equipmentService.max += 50;
    this.equipmentService.last += 50;
    if (this.equipmentService.max > 50){
      this.previousDisabled = false;
    }
    if (this.equipmentService.max >= 300){
      // alert('You have come to the end of the data');
      this.nextDisabled = true;
    }
    this.buttonColor();
    console.log( this.equipmentService.max, this.equipmentService.last);

    this.chart.ngOnInit();

  }

  previous(): void {
    this.equipmentService.max -= 50;
    this.equipmentService.last -= 50;
    if (this.equipmentService.max <= 50){
      this.previousDisabled = true;
    }
    if (this.equipmentService.max < 300){
      this.nextDisabled = false;
    }
    this.buttonColor();
    console.log( this.equipmentService.max, this.equipmentService.last);
  }

  buttonColor(): void {
    if (this.previousDisabled){
      this.previousColor = 'grey';
    }else{
      this.previousColor = 'dodgerblue';
    }
    if (this.nextDisabled){
      this.nextColor = 'grey';
    }else{
      this.nextColor = 'dodgerblue';
    }
  }

}
