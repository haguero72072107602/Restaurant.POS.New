import {Component} from '@angular/core';
import {AdminOptionsService} from "@core/services/bussiness-logic/admin-options.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {DlgClosebatchComponent} from "@modules/home/component/dlg-closebatch/dlg-closebatch.component";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-rpt-close-batch',
  templateUrl: './rpt-close-batch.component.html',
  styleUrls: ['./rpt-close-batch.component.css']
})
export class RptCloseBatchComponent {

  constructor(
    private adminService: AdminOptionsService,
    private dialogService: DialogService,
    private operationService: OperationsService
  ) {
  }

  closeBatch() {
    this.dialogService.dialog.open(DlgClosebatchComponent, {
      width: '648', height: '360px',
      data: {},
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
    });
  }
}
