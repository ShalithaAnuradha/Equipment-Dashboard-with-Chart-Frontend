import {Component, Injectable, OnInit, Output} from '@angular/core';
import {EquipmentService} from '../service/equipment.service';
import {Chart} from "../model/chart";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit {

  private chartData: Array<Chart> =  [];

  constructor(public equipmentService: EquipmentService) { }

  ngOnInit(): void {

    this.equipmentService.getAllEquipments().subscribe(list => {
      this.equipmentService.equipmentList = list;
      console.log(list.length);
      let noOfOperationalEquipments = 0;
      const equipmentTypes = [...new Set(list.map(equipment => equipment.AssetCategoryID))];
      let noOfEquipmentForEachType: Array<number> = Array(equipmentTypes.length).fill(0);
      for (const equipment of list) {
        if (equipment.OperationalStatus === 'Operational'){
          noOfOperationalEquipments++;
        }
        // console.log(equipment.AssetCategoryID);
        const index = equipmentTypes.indexOf(equipment.AssetCategoryID);
        const existingValue = noOfEquipmentForEachType[index];
        noOfEquipmentForEachType.splice(index, 1,  existingValue + 1);
      }
      console.log(noOfEquipmentForEachType);
      console.log(equipmentTypes);
      for (let i = 0; i < equipmentTypes.length; i++) {
        this.chartData.push(new Chart(equipmentTypes[i], noOfEquipmentForEachType[i]));
      }

      console.log(this.chartData);

      setTimeout(() => {
        console.log('Hii');
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
              "caption": "Countries With Most Oil Reserves [2017-18]",
              "subCaption": "In MMbbl = One Million barrels",
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

}
