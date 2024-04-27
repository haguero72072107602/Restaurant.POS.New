import {Component, OnDestroy, OnInit} from '@angular/core';
import {StockService} from "@core/services/bussiness-logic/stock.service";
import {Department} from "@models/department.model";
import {EDepartmentType} from "@core/utils/department-type.enum";
import {Subscription} from "rxjs";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ProductOrderService} from "@core/services/bussiness-logic/product-order.service";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {Router} from "@angular/router";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {SlideModel} from "@modules/home/component/slider/slider.component";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DlgPayMethodComponent} from "@modules/home/component/dlg-pay-method/dlg-pay-method.component";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {Invoice} from "@models/invoice.model";

@Component({
  selector: 'app-list-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent extends AbstractInstanceClass implements OnInit, OnDestroy {

  departaments: Department[] = [];
  subscriptions: Subscription[] = [];
  picker: any;

  protected readonly RangeDateOperation = RangeDateOperation;

  constructor(
    private router: Router,
    public stockService: StockService,
    private searchService: SearchService,
    private invoiceService: InvoiceService,
    private productOrderService: ProductOrderService,
    private departProductService: DepartProductService,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private operationService: OperationsService
  ) {
    super();
    this.searchService.setActivePage(PageSidebarEnum.STORE);
  }

  override ngOnInit(): void {
    this.searchService.clearSearch();
    //this.getDepartments();

    this.departProductService.searchDepartObservable().subscribe((next: boolean) => {
      if (next) {
        this.getDepartments();
      }
    })


    this.sub$.push(
      this.searchService.searchObservable().subscribe((search: string) => {
        if (search!.trim() != "") {
          this.router.navigateByUrl("/home/layout/invoice/products/-99")
        }
      }));
  }

  getDepartments() {

    this.departaments = this.departProductService.getDepartament()
      .filter((dpto: Department) => dpto.departmentType !== EDepartmentType.CHILD && dpto.visible);
    this.productOrderService.departments = this.departaments;
  }

  evOpenInvoice($event: Invoice) {
    this.operationService.reopenOrder($event.receiptNumber!, false);
  }
}
