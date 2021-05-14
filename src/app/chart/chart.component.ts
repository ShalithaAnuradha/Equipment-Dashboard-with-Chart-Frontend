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

export class ChartComponent implements OnInit {

  private chartData: Array<Chart> = [];
  previousDisabled = true;
  nextDisabled = false;
  previousColor = 'black';
  nextColor = 'black';
  operational: any;
  nonOperational: any;
  wholeList: any;
  goForward = true;

  constructor(public equipmentService: EquipmentService) {
  }

  ngOnInit(): void {

    /*For all the data in one graph*/
    // this.equipmentService.getAllEquipments(350, 0).subscribe(wholeList => {this.wholeList = wholeList; });

    this.displayChart(50, 0, true);

  }


  displayChart(max: number, last: number, goForward: boolean): void {
    this.equipmentService.getAllEquipments(max, last).subscribe(list => {
      this.equipmentService.equipmentList = list;
      const lastRowId = parseInt(list[list.length - 1].__rowid__, 10);

      // console.log( 'Length of the equipmentList: ' + list.length);
      console.log('Last __rowid__ value = ' + lastRowId);
      if(lastRowId === 298){
          this.nextDisabled = true;
      }
      if (goForward) {
        this.equipmentService.last = lastRowId;
      }

      let noOfOperationalEquipments = 0;
      const equipmentTypes = [...new Set(list.map(equipment => equipment.AssetCategoryID))];
      const noOfEquipmentForEachType: Array<number> = Array(equipmentTypes.length).fill(0);
      for (const equipment of list) {
        if (equipment.OperationalStatus === 'Operational') {
          noOfOperationalEquipments++;
        }
        // console.log(equipment.AssetCategoryID);
        const index = equipmentTypes.indexOf(equipment.AssetCategoryID);
        const existingValue = noOfEquipmentForEachType[index];
        noOfEquipmentForEachType.splice(index, 1, existingValue + 1);
      }


      this.chartData = [];
      for (let i = 0; i < equipmentTypes.length; i++) {
        this.chartData.push(new Chart(equipmentTypes[i], noOfEquipmentForEachType[i]));
      }

      this.operational = noOfOperationalEquipments;
      this.nonOperational = list.length - noOfOperationalEquipments;
      this.chartRender();

    });
  }

  chartRender(): void{
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
        chart: {
          caption: 'No of Equipments Vs Equipment Type',
          subCaption: 'For 50 equipments',
          xAxisName: 'Equipment Type',
          yAxisName: 'No of Equipments',
          numberSuffix: '',   // "K -> 200K, 300K"
          theme: 'fusion',
        },
        // Chart Data
        data: chartData
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
  }

  next(): void {
    this.equipmentService.max += 50;
    this.nextDisabled = true;
    // console.log( 'max: ' + this.equipmentService.max,  'last-previousValue: ' +  this.equipmentService.last);
    const last = this.equipmentService.last;
    this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, true);
    console.log(this.nextDisabled);
    setTimeout(() => {
      this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, true);
      this.nextDisabled = false;
    }, 500);
    console.log(this.nextDisabled);
    if (this.equipmentService.max >= 50) {
      this.previousDisabled = false;
    }
    if (this.equipmentService.max >= 250) {
      this.nextDisabled = true;
    }
    console.log('max:' + this.equipmentService.max);
    this.buttonColor();
    this.chartRender();
  }


  previous(): void {
    this.equipmentService.max -= 50;
    if (this.equipmentService.max <= 50) {
      this.previousDisabled = true;
    }
    if (this.equipmentService.max < 300) {
      this.nextDisabled = false;
    }
    console.log(this.equipmentService.max, this.equipmentService.last);
    this.equipmentService.last -= 50;
    this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, false);
    this.buttonColor();

  }

  buttonColor(): void {
    if (this.previousDisabled) {
      this.previousColor = 'grey';
    } else {
      this.previousColor = 'dodgerblue';
    }
    if (this.nextDisabled) {
      this.nextColor = 'grey';
    } else {
      this.nextColor = 'dodgerblue';
    }
  }


}
