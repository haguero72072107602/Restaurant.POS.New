import {Component, OnInit} from '@angular/core';
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {Invoice} from "@models/invoice.model";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {
  constructor(
    private searchService: SearchService,
    private operationService: OperationsService
  ) {
    this.searchService.setActivePage(PageSidebarEnum.INVENTORY)
  }

  evOpenInvoice($event: Invoice) {

  }
}
