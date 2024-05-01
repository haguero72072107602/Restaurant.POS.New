import {Injectable} from "@angular/core";
import {IOptionsOrders} from "@models/options/options-orders.model";
import {DateRange} from "@angular/material/datepicker";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";

@Injectable({
  providedIn: 'root'
})
export class OptionsService {
  private orders! : IOptionsOrders;

  constructor() {
    this.orders = {
      dateRange: new DateRange<Date>(new Date(),new Date()),
      table: "",
      statusInvoice: [InvoiceStatus.IN_PROGRESS || InvoiceStatus.CREATED]
    }
  }

  setOrders( dateRange?: DateRange<Date>, table?: string, statusInvoice?: InvoiceStatus[])
  {
    if (!!dateRange)
    {
      this.orders = {...this.orders, dateRange };
    }

    if (!!table)
    {
      this.orders = {...this.orders, table};
    }

    if (!!statusInvoice)
    {
      this.orders = {...this.orders, statusInvoice};
    }

  }

  get getOrders() : IOptionsOrders
  {
    return this.orders!
  }

}
