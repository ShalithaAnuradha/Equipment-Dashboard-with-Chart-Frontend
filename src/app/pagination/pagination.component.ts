import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  previousDisables = true;
  nextDisabled = false;

  constructor() { }

  ngOnInit(): void {
  }

  next() {
    alert("OKey");

  }

  previous() {
    alert("Prev");
  }
}
