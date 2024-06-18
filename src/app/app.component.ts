import {Component, OnInit} from '@angular/core';
import {initFlowbite} from 'flowbite';
import {InitViewService} from "@core/services/bussiness-logic/init-view.service";
import {TranslateService} from "@ngx-translate/core";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {Configuration} from "@models/configuration.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Restaurant.POS.New';

  constructor(
    public translate: TranslateService,
    private dataStore: DataStorageService,
    public configurService: ConfigurationService,
    private initViewService: InitViewService) {

    translate.addLangs(['en', 'es']);

    this.dataStore.getConfiguration().subscribe( (next: Configuration) => {
      translate.setDefaultLang( next.language!.toLowerCase() );
    })
    this.initViewService.getStationStatus();
  }

  ngOnInit(): void {
    initFlowbite();
    console.log("Active notification user ");
  }
}
