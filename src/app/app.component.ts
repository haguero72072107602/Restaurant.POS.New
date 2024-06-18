import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {InitViewService} from "@core/services/bussiness-logic/init-view.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Restaurant.POS.New';

  constructor(
    public translate: TranslateService,
    private initViewService: InitViewService) {

    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');

    this.initViewService.getStationStatus();
  }

  ngOnInit(): void {
    initFlowbite();
    console.log("Active notification user ");
  }
}
