import {
  Component,
  DoCheck,
  EventEmitter,
  Injectable,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {EquipmentService} from '../service/equipment.service';
import {Chart} from '../model/chart';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit{

  private chartData: Array<Chart> = [];
  previousDisabled = true;
  nextDisabled = false;
  previousColor = 'grey';
  nextColor = 'dodgerblue';

  constructor(public equipmentService: EquipmentService) {
  }

  ngOnInit(): void {
    console.log("Start");
    this.displayChart( 50, 0);
  }



  displayChart(max: number, last: number): void {
    this.equipmentService.getAllEquipments(max, last).subscribe(list => {
      this.equipmentService.equipmentList = list;
      console.log(list.length);
      let noOfOperationalEquipments = 0;
      const equipmentTypes = [...new Set(list.map(equipment => equipment.AssetCategoryID))];
      const noOfEquipmentForEachType: Array<number> = Array(equipmentTypes.length).fill(0);
      for (const equipment of list) {
        if (equipment.OperationalStatus === 'Operational'){
          noOfOperationalEquipments++;
        }
        // console.log(equipment.AssetCategoryID);
        const index = equipmentTypes.indexOf(equipment.AssetCategoryID);
        const existingValue = noOfEquipmentForEachType[index];
        noOfEquipmentForEachType.splice(index, 1,  existingValue + 1);
      }

      for (let i = 0; i < equipmentTypes.length; i++) {
        this.chartData.push(new Chart(equipmentTypes[i], noOfEquipmentForEachType[i]));
      }

      setTimeout(() => {
        this.equipmentService.operational = noOfOperationalEquipments;
        this.equipmentService.nonOperational = list.length - noOfOperationalEquipments;


        const chartData = this.chartData;

        // STEP 3 - Chart Configurations
        const chartConfig = {
          type: 'column2d',
          renderAt: 'chart-container',
          width: '100%',
          height: '400',
          dataFormat: 'json',
          dataSource: {
            // Chart Configuration
            "chart": {
              "caption": "No of Equipments Vs Equipment Type",
              "subCaption": "For 50 equipments",
              "xAxisName": "Equipment Type",
              "yAxisName": "No of Equipments",
              "numberSuffix": "",   //"K -> 200K, 300K"
              "theme": "fusion",
            },
            // Chart Data
            "data": chartData
          }
        };
        // @ts-ignore
        FusionCharts.ready(() => {
          // tslint:disable-next-line:prefer-const
          // @ts-ignore
          // tslint:disable-next-line:prefer-const
          let fusioncharts = new FusionCharts(chartConfig);
          fusioncharts.render();
        });

      }, 50);
    });
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
    this.displayChart(this.equipmentService.max, this.equipmentService.last);
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
