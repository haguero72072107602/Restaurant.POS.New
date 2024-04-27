import {Component} from '@angular/core';
import {AuthService} from "@core/services/api/auth.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  constructor(public authService: AuthService,
              private searchService: SearchService,
              private operationService: OperationsService,
  ) {
    this.searchService.setActivePage(PageSidebarEnum.REPORT)
  }
}
