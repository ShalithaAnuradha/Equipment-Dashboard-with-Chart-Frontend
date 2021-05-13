import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Dashboard-frontend';
  dataDetails: Array<number> = [];

  send(dataDetails: Array<number>): void{
    this.dataDetails = dataDetails;
  }
}
