import {Pipe, PipeTransform} from "@angular/core";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {ProductOrder} from "@models/product-order.model";

@Pipe({
  name: 'FilterProductOrder'
})
export class FilterProductOrderPipe implements PipeTransform {

  constructor(private invoiceService: InvoiceService) {
  }

  transform(value: ProductOrder[], ...args: any[]): ProductOrder[] {
    console.log("Filter product order", args[0]);
    return args[0] != undefined ?
      value.filter(p => p.position === Number(args[0])) : [];
  }

}



