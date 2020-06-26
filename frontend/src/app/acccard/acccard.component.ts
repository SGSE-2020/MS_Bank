import { Component, OnInit } from '@angular/core';

declare function addAccountToView(): any;

@Component({
  selector: 'app-acccard',
  templateUrl: './acccard.component.html',
  styleUrls: ['./acccard.component.css']
})
export class AcccardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //addAccountToView();
  }

}
