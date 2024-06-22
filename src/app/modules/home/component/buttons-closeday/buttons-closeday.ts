import {Component} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {FinancialCloseDayModel} from "@models/financials/FinancialCloseDay.model";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {AuthService} from "@core/services/api/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-buttons-closeday',
  templateUrl: './buttons-closeday.html',
  styleUrls: ['./buttons-closeday.css']
})
export class ButtonsCloseDay implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  status: number = 0;
  receiptNumber: undefined | string;
  report?: FinancialCloseDayModel;

  constructor(private reportService: ReportsService,
              private authService: AuthService,
              private routeActivated: ActivatedRoute,
              private dialogService: DialogService,
              private router: Router,) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.status = this.params!.data!.status;
    this.receiptNumber = this.params!.data!.receiptNumber;

    this.report = this.params!.data!

    console.log('Table cell', params);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }

  viewClose() {
    this.router.navigate([`/home/layout/reports/rptfinancialdetails`],
      {
        queryParams: {
          //order: this.params.data., 'price-range': 'not-cheap'
          openingTime: this.params.data.openingTime,
          closeTime: this.params.data.closeTime,
          userId: this.params.data.userId,
          isManager: this.params.data.isManager,
        }
      }
    );
  }

  printClose() {
    const dialog =
      this.dialogService.openDialog(ProgressSpinnerComponent, "", "289px", "316px");

    if (this.params!.data!.isManager) {

      this.reportService.getRangeClosePrint(this.report!.openingTime, this.report!.closeTime)
        .subscribe((next: any) => {
          dialog!.close()
        }, error => {
          dialog!.close();
          this.dialogService.openGenericInfo("Error", error)
        })
    } else {
      this.reportService
        .cashierCloseShiftPrint(false, true, this.report!.userId,
          this.report!.openingTime, this.report!.closeTime)
        .subscribe((next: any) => {
          dialog!.close()
        }, error => {
          dialog!.close();
          this.dialogService.openGenericInfo("Error", error)
        })
    }
  }
}
