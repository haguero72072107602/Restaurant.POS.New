import {Component} from '@angular/core';
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent {
  constructor(
    private searchService: SearchService
  ) {
    //this.searchService.setActivePage(PageSidebarEnum.)
  }
}
