import { Component, OnInit } from '@angular/core';

declare function addAccountSelect(): any;

@Component({
  selector: 'app-exchangeview',
  templateUrl: './exchangeview.component.html',
  styleUrls: ['./exchangeview.component.css']
})
export class ExchangeviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    addAccountSelect();
  }

}
