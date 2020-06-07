import { Component, OnInit } from '@angular/core';

declare function isLogged(): any;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    isLogged();
  }

}
