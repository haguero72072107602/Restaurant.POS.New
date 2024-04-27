import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {InitViewService} from "@core/services/bussiness-logic/init-view.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Restaurant.POS.New';

  constructor(
    private initViewService: InitViewService) {
    this.initViewService.getStationStatus();
  }

  ngOnInit(): void {
    initFlowbite();
    console.log("Active notification user ");
  }
}
