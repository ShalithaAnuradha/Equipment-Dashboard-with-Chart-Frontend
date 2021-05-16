import {
  Component,
  OnInit,
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
  previousColor = 'dodgerblue';
  nextColor = 'grey';
  operational: any;
  nonOperational: any;
  wholeList: any;
  lastRowId = 0;

  constructor(public equipmentService: EquipmentService) {
  }

  ngOnInit(): void {
    /*When required to show all the data in one graph*/
    // this.equipmentService.getAllEquipments(350, 0).subscribe(wholeList => {this.wholeList = wholeList; });

    // When page rendering first time, display the chart with data set of max = 50 and last = 0
    this.displayChart(50, 0, true);

  }

  // Get data from the equipment service and apply them as chart data.
  displayChart(max: number, last: number, goForward: boolean): void {
    // get the data set of equipments as a Observable.
    this.equipmentService.getAllEquipments(max, last).subscribe(list => {
      this.equipmentService.equipmentList = list;

      // Get the row id of the last object to the variable of lastRowId
      this.lastRowId = parseInt(list[list.length - 1].__rowid__, 10);

      // Change the button status and color for turning points.
      if (this.lastRowId === 298) {
        this.nextDisabled = true;
        this.nextColor = 'grey';
      }
      if (this.lastRowId === 50) {
        this.previousDisabled = true;
        this.previousColor = 'grey';
        this.nextColor = 'dodgerblue';
      }

      // Change the last value for the next get request to the last row id of this request.
      this.equipmentService.last = this.lastRowId;

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

  // Show next data set (next 50 equipment) in the graph
  next(): void {
    this.nextDisabled = true;

    // Display the chart [1]
    this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, true);

    // Sometimes backend took a little bit of time to receive the data and then [1] Display chart won't work properly.
    // So that method was called again if there is some issue again after 500ms and within that time the button status
    // is change to disabled. You can change this time duration with respect to your machine's performance and other factors.
    setTimeout(() => {
      this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, true);
      this.nextDisabled = false;
      this.buttonColor();
    }, 500);

    // Change the button status according to current row id of the last object.
    if (this.lastRowId > 50) {
      this.previousDisabled = false;
      this.nextColor = 'dodgerblue';
    }
    if (this.lastRowId > 250) {
      this.nextDisabled = true;
    }
    this.buttonColor();
    this.chartRender();
  }

  // Show previous data set (previous 50 equipment) in the graph
  previous(): void {

    // Reduce the last value for the next get request according to the last row id
    // Even though here 298 is directly used, it could be done sending a get request to get whole data once and find that
    // number by dynamically.
    if (this.lastRowId === 298) {
      this.equipmentService.last -= 98;
    } else {
      this.equipmentService.last -= 100;
    }

    // Display the chart [2]
    this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, false);

    // Sometimes backend took a little bit of time to receive the data and then [2] Display chart won't work properly.
    // So that method was called again if there is some issue again after 1000ms and within that time the button status
    // is change to disabled.
    setTimeout(() => {
      this.displayChart(this.equipmentService.noOfElements, this.equipmentService.last, false);
      this.nextDisabled = false;
      this.buttonColor();
    }, 1000);

    // Change the button status according to current row id of the last object.
    if (this.lastRowId <= 50) {
      this.previousDisabled = true;
    }
    if (this.lastRowId < 298) {
      this.nextDisabled = false;
    }
    this.buttonColor();
    this.chartRender();
  }

  // Change the button color according to its disabled status
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
