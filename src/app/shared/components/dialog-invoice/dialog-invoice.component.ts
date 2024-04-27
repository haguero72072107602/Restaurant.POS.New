import {Component, Inject} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogFilterComponent} from "../../containers/dialog-filter/dialog-filter.component";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'dialog-invoice.component',
  templateUrl: 'dialog-invoice.component.html',
  styleUrls: ['dialog-invoice.component.scss']
})
export class DialogInvoiceComponent {
  title = "Invoices";
  subtitle = "Select a invoice:";
  page = 1;
  sizePage = 12;
  showFilter: boolean = true;
  breakText: string;

  constructor(
    private cashService: CashService,
    private dialogService: DialogService,
    public dialogRef: MatDialogRef<DialogInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.title) this.title = data.title;
    if (data.subtitle) this.subtitle = data.subtitle;
    if (data.filter) this.showFilter = data.filter;
    this.breakText = this.cashService.config.sysConfig.breakText!;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setPage(ev: any) {
    this.page = ev;
  }

  filter() {
    this.dialogService.dialog.open(DialogFilterComponent, {width: '1024px', height: '600px', disableClose: true})
      .afterClosed()
      .subscribe((next: any) => {
        if (next) {
          console.log('filterDialog', next, this.data.invoice);
          let invoices = this.data.invoice.filter((i: any) => i.orderInfo && i.orderInfo.toUpperCase().includes(next.text));
          invoices.length <= 0 ?
            this.dialogService.openGenericInfo('Information', 'Not match any elements with the specified filter')
            : this.data.invoice = invoices;
          this.page = 1;
        }
      });
  }

}

