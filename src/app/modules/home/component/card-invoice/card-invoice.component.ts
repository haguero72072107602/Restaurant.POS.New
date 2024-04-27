import {Component, Input, OnInit} from '@angular/core';
import {ProductOrder} from "@models/product-order.model";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";
import {Invoice} from "@models/invoice.model";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-card-invoice',
  templateUrl: './card-invoice.component.html',
  styleUrls: ['./card-invoice.component.css']
})
export class CardInvoiceComponent implements OnInit {
  @Input() positions: number = 0;
  @Input() productOrders?: ProductOrder[]
  @Input() editProductOrders: boolean = true;

  private isSelected: boolean = false;

  constructor(
    private colorsService: ColorsService,
    private invoiceService: InvoiceService,
    private operationService: OperationsService,
  ) {
  }

  get getTableUse() {
    return this.invoiceService.order!.table!.label
  }

  ngOnInit(): void {
    this.isSelected = this.positions === 0;
  }

  onTax() {
    const sum = this.productOrders!.reduce((accumulator, currentValue) => {
      return accumulator + currentValue!.tax!
    }, 0);

    return sum?.toFixed(2)
  }

  onDiscount() {
    const sum = this.productOrders!.reduce((accumulator, currentValue) => {
      return accumulator + currentValue!.discount!
    }, 0);
    return sum?.toFixed(2)
  }

  onSubTotal() {
    const sum = this.productOrders!.reduce((accumulator, currentValue) => {
      return accumulator + currentValue!.subTotal!
    }, 0);
    return sum?.toFixed(2)
  }

  onPaid() {
    const sum = !isNaN(this.invoiceService.invoice?.balance!) ?
      (this.invoiceService.invoice?.total! - this.invoiceService.invoice?.balance!) :
      this.invoiceService.invoice?.total!;

    return sum?.toFixed(2)
  }

  onBalance() {
    const sum = this.invoiceService.invoice?.balance!
    return sum?.toFixed(2)
  }

  onSubCharge() {
    return this.invoiceService.invoice?.subCharge?.toFixed(2);
  }

  onTotal() {
    const sum = this.productOrders!.reduce((accumulator, currentValue) => {
      return accumulator + currentValue!.total!
    }, 0);
    return sum?.toFixed(2)
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  compareNumbers(a: any, b: any) {
    return a - b;
  }

  onGroupByProducts(items: ProductOrder[]) {
    const value = this.groupBy(items, i => i.position);
    const look = Object.keys(value).sort(this.compareNumbers)
    console.log(look);
    return look.map((str) => {
      return parseInt(str)
    });
  }

  getFilterProducts(productOrders: ProductOrder[], position: number) {
    return productOrders.filter(p => p.position === position);
  }

  getColor(position: number) {
    return "background: " + this.colorsService.getColor(position);
  }

  onPrint() {
    this.operationService.reprint();
  }


}
