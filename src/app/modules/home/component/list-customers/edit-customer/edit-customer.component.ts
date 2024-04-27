import {Component} from '@angular/core';
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {DateRangeComponent} from "@modules/home/component/daterange/daterange.component";
import {OrderCustomerComponent} from "@modules/home/component/list-customers/order-customer/order-customer.component";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "@core/services/bussiness-logic/customer.service";
import {DateRange} from "@angular/material/datepicker";
import {fnFormatDate, fnSetRangeDate} from "@core/utils/functions/functions";
import {InfoCustomer} from "@models/info-user.model";
import {CurrencyPipe, DatePipe} from "@angular/common";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    DateRangeComponent,
    OrderCustomerComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {

  idCustomer!: string;
  dateRange!: DateRange<Date>;
  customer!: InfoCustomer;
  protected readonly RangeDateOperation = RangeDateOperation;

  constructor(
    private activeRouter: ActivatedRoute,
    private customerService: CustomerService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.activeRouter.paramMap.subscribe(params => {
      console.log(params);
      this.idCustomer = params.get("id")!;

      this.dateRange = fnSetRangeDate(RangeDateOperation.ThisMonth);

      this.getSalesReport(this.idCustomer, fnFormatDate(this.dateRange.start!), fnFormatDate(this.dateRange.end!));
    });
  }

  getSalesReport(id: string, startDate: string, endDate: string) {
    this.customerService.customerSalesReport(id, startDate, endDate)
      .subscribe((next: InfoCustomer) => {
        console.log(next)
        this.customer = next
      }, error => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error, undefined, DialogConfirm.BTN_CLOSE);
        this.router.navigateByUrl("/home/layout/customers/list");
      });
  }


}
