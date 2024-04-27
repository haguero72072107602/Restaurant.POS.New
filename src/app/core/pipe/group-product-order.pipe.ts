import {Pipe, PipeTransform} from "@angular/core";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {ProductOrder} from "@models/product-order.model";

@Pipe({
  name: 'GroupProductOrder'
})
export class GroupProductOrderPipe implements PipeTransform {

  constructor(private invoiceService: InvoiceService) {
  }

  transform(value: ProductOrder[], ...args: any[]): number[] {
    return this.invoiceService.groupByProductOrder(value);
  }

}

