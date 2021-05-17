import {Component, OnInit} from '@angular/core';
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
  operational: any;
  nonOperational: any;
  last = 0;

  constructor(public equipmentService: EquipmentService) {
  }

  ngOnInit(): void {
    // When page rendering first time, display the chart with data set of max = 50 and last = 0
    this.displayChart(300, 0);
  }

  // Get data from the equipment service and apply them as chart data.
  displayChart(max: number, last: number): void {
    // get the data set of equipments as a Observable.
    this.equipmentService.getAllEquipments(max, last).subscribe(list => {

      this.equipmentService.equipmentList = list;
      let noOfOperationalEquipments = 0;

      // Create a unique list for equipment types.
      const equipmentTypes = [...new Set(list.map(equipment => equipment.AssetCategoryID))];

      // Create a list for no of equipment of each type having same length of equipment types and filled with zeros.
      const noOfEquipmentForEachType: Array<number> = Array(equipmentTypes.length).fill(0);

      // Count the no of operational equipments
      for (const equipment of list) {
        if (equipment.OperationalStatus === 'Operational') {
          noOfOperationalEquipments++;
        }

        // Get the index for each equipment in equipmentTypes list according to equipment type(AssetCategoryID).
        const index = equipmentTypes.indexOf(equipment.AssetCategoryID);

        // Get the existing value in no noOfEquipmentForEachType list for this index
        const existingValue = noOfEquipmentForEachType[index];

        // Increase that existing value by 1 by replacing existing value.
        noOfEquipmentForEachType.splice(index, 1, existingValue + 1);
      }

      // Empty the chart for every method call to remove the previous data of the chart.
      this.chartData = [];

      // Add new data to the chart
      for (let i = 0; i < equipmentTypes.length; i++) {
        this.chartData.push(new Chart(equipmentTypes[i], noOfEquipmentForEachType[i]));
      }

      // Update the Operational and Non-Operational status of the each 50 equipment for each method call
      this.operational = noOfOperationalEquipments;
      this.nonOperational = list.length - noOfOperationalEquipments;

      // Render the Chart to display on the web page
      this.chartRender();

    }, err => {
      console.log('ERROR: ' + err.message);
    });
  }

  // Render the chart into the web page.
  chartRender(): void {
    const chartData = this.chartData;

    // Chart Configurations
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
          subCaption: 'For All equipments',
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

}
