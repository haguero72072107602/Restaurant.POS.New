import {Component, Input, OnInit, SecurityContext} from '@angular/core';
import {Department} from "@models/department.model";
import {Router} from "@angular/router";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {ProductOrderService} from "@core/services/bussiness-logic/product-order.service";
import {map} from "rxjs/operators";
import {Product} from "@models/product.model";
import {StockService} from '@core/services/bussiness-logic/stock.service';
import {DomSanitizer} from "@angular/platform-browser";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {ETXType} from "@core/utils/delivery.enum";
import {Order} from "@models/order.model";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-card-category',
  templateUrl: './card-category.component.html',
  styleUrls: ['./card-category.component.css']
})
export class CardCategoryComponent implements OnInit {
  @Input() departament: Department | undefined;

  constructor(private router: Router,
              private productOrderService: ProductOrderService,
              private stockService: StockService,
              private dialogService: DialogService,
              private operationService: OperationsService,
              private sanitizer: DomSanitizer,
              private invoiceService: InvoiceService) {
  }

  ngOnInit(): void {
  }

  onProcessProduct(prods: Product[]) {
    if (this.invoiceService.invoice)
      this.invoiceService.invoice!.status = InvoiceStatus.IN_PROGRESS;
    if (prods.length > 0) {
      this.productOrderService.addProduct(prods[0]);
    } else {
      this.dialogService.openGenericInfo('Error', "There is no product for this criterion");
    }
  }

  onProductsFromDepartment(id: any) {
    if (this.departament?.generic) {
      if (this.invoiceService.txType === ETXType.DINEIN && this.invoiceService.order === undefined) {
        this.operationService.openAssignTable().subscribe((next: any) => {
          if (next) {
            this.invoiceService.createInvoice(ETXType.DINEIN, next.table!.id, i => {
              this.invoiceService.setDineIn(next.table)
                .subscribe((next: Order) => {
                  this.invoiceService.order = next;
                  this.invoiceService.setOrderEmit(next);
                }, error => {
                  this.dialogService.openGenericInfo("Error", error)
                });
            });
          }
        });
      } else {
        this.stockService.getProductsByDepartment(id, 0, 0)
          .subscribe((prods: Product[]) => {
            console.log("products ", prods);

            this.invoiceService.isNullInvoice() ?
              this.invoiceService.createInvoice(ETXType.FAST_FOOD, undefined, i => {
                this.onProcessProduct(prods)
              }) :
              this.onProcessProduct(prods);

          }, (error1: any) => {
            console.log(error1);
            this.dialogService.openGenericInfo('Error', error1);
          });
      }
    } else {
      this.router.navigateByUrl("home/layout/invoice/products/" + id);
    }
  }
}
