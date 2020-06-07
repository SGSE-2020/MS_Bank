import { Component, OnInit } from '@angular/core';

declare function logoutChecker(): any;

@Component({
  selector: 'app-logginview',
  templateUrl: './logginview.component.html',
  styleUrls: ['./logginview.component.css']
})
export class LogginviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    logoutChecker();
  }

}
