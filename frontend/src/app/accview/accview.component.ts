import { Component, OnInit } from '@angular/core';

declare function addAccountSelect(): any;

@Component({
  selector: 'app-accview',
  templateUrl: './accview.component.html',
  styleUrls: ['./accview.component.css']
})
export class AccviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    addAccountSelect();
  }

}
