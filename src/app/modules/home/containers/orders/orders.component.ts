import {Component, Inject, OnInit} from '@angular/core';
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  constructor(
    private searchService: SearchService,
    private operationService: OperationsService
  ) {
    this.operationService.resetInactivity(true);
  }
}
