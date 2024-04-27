import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Table} from "@models/table.model";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {AuthService} from "@core/services/api/auth.service";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-assign-table',
  templateUrl: './assign-table.component.html',
  styleUrls: ['./assign-table.component.css']
})
export class AssignTableComponent implements OnInit {

  tables: Table[] = [];
  tableActive?: Table;

  constructor(
    private invoiceService: InvoiceService,
    private dialogService: DialogService,
    private authService: AuthService,
    private colorsService: ColorsService,
    private tableService: TablesService,
    private dialogRef: MatDialogRef<AssignTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.invoiceService.tables().subscribe((next: Table[]) => {
        console.log(this.authService!.token!.rol);
        if (this.authService!.token!.rol == UserrolEnum.ADMIN) {
          this.tables = next.filter(t => t.status != 0 && t.chairNumber! > 0);
        } else {
          if (this.authService.token!.user_id) {
            this.tables = next
              .filter(f => f.posUserId === this.authService.token!.user_id &&
                f.status != 0 &&
                f.chairNumber! > 0);
          }
        }
      },
      error => {
        this.dialogService.openGenericInfo("Error", error)
      });
  }

  onClose() {
    this.dialogRef.close()
  }

  onSelected(value: any) {
    this.tableActive = value;
  }

  onSelectTable() {
    if (this.tableActive) {
      this.dialogRef.close({table: this.tableActive});
    }
  }

  getColorBorder(status: number) {
    return status === 0 ? "border-color: " + this.colorsService.getColorStatus(status, 1) :
      "border-color: " + this.colorsService.getColorStatus(status)
  }

  getColorCircle(status: number) {
    return "color: " + this.colorsService.getColorStatus(status, 0) + "; " +
      "background-color: " + this.colorsService.getColorStatus(status, 1) + "; background-opacity: 0.1;";
  }

  getStatusTable(status: number) {
    return this.tableService.getTextStatus(status)
  }
}
