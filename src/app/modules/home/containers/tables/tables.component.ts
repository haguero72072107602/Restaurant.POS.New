import {Component} from '@angular/core';
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent {
  constructor(
    private searchService: SearchService,
    private operationService: OperationsService
  ) {
    this.searchService.setActivePage(PageSidebarEnum.TABLES)
  }
}
