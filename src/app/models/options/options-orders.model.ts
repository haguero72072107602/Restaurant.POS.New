import {DateRange} from "@angular/material/datepicker";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";

export interface IOptionsOrders {
  table? : string;
  dateRange? : DateRange<Date>
  statusInvoice: InvoiceStatus[]
}
