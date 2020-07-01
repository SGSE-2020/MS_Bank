import { Component, OnInit } from '@angular/core';

declare function addAccountSelect(): any;

@Component({
  selector: 'app-settingsview',
  templateUrl: './settingsview.component.html',
  styleUrls: ['./settingsview.component.css']
})
export class SettingsviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    addAccountSelect();
  }

}
