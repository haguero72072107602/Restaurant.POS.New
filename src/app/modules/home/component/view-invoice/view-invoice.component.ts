import {Component, OnInit} from '@angular/core';
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {Router, UrlTree} from "@angular/router";
import {PaymentOpEnum} from '@core/utils/operations';
import {CanComponentDeactivate} from "@core/guards/candeactivate.guard";
import {Observable} from "rxjs";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css']
})
export class ViewInvoiceComponent implements CanComponentDeactivate, OnInit {

  protected readonly PaymentOpEnum = PaymentOpEnum;
  private cancelOperation: boolean = false;

  constructor(
    public invoiceService: InvoiceService,
    private operationService: OperationsService,
    private searchService: SearchService,
    private router: Router) {
  }

  ngOnInit(): void {
    //this.searchService.setStateButtons(true);
    this.searchService.setActivePage(PageSidebarEnum.ORDERS);
  }

  canDeactivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    this.invoiceService.removeInvoice();

    //if (this.cancelOperation!)
    //{
    //  this.searchService.setStateButtons(false);
    //}

    return true;
  };

  onAllOrder() {
    this.operationService.resetSubTotalState();
  }

  onCancelOperation() {
    //this.cancelOperation = true;
    //this.invoiceService.removeInvoice();
    this.invoiceService.gotoRouter();
  }
}
