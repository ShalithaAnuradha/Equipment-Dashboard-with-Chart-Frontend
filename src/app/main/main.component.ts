import {Component, OnInit} from '@angular/core';
import {get} from 'scriptjs';

declare var google: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {
    console.log(google);
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart(): void{
    const data = google.visualization.arrayToDataTable([
      ['Element', 'Density', {role: 'style'}],
      ['Copper', 8.94, 'dodgerblue'],
      ['Silver', 10.49, 'dodgerblue'],
      ['Gold', 19.30, 'dodgerblue'],
      ['Platinum', 21.45, 'color: dodgerblue'],
    ]);

    const view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
      {
        calc: 'stringify',
        sourceColumn: 1,
        type: 'string',
        role: 'annotation'
      },
      2]);

    const options = {
      title: 'Density of Precious Metals, in g/cm^3',
      width: 600,
      height: 400,
      bar: {groupWidth: '50%'},
      legend: {position: 'none'},
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('column-chart'));
    chart.draw(view, options);
  }


}

