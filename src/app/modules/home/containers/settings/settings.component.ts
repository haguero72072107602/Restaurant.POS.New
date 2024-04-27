import {Component} from '@angular/core';
import {DlgClosebatchComponent} from "@modules/home/component/dlg-closebatch/dlg-closebatch.component";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  selectOption: number = -1;

  constructor(
    private cashService: CashService,
    private reportService: ReportsService,
    private dialogService: DialogService,
    private searchService: SearchService,
    private operationService: OperationsService
  ) {
    this.searchService.setActivePage(PageSidebarEnum.SETTINGS)
  }


  closeBatch() {
    this.dialogService.dialog.open(DlgClosebatchComponent, {
      width: '648', height: '360px',
      data: {},
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
      if (next) {
        const dialog =
          this.dialogService.openDialog(ProgressSpinnerComponent, "", "289px", "316px");

        this.reportService.closeBatch(next.closeBatch).subscribe(
          next => {
            dialog.close()

          }, error => {
            dialog.close();
            this.dialogService.openGenericInfo("Error", error)
          });
      }
    });
  }
}
