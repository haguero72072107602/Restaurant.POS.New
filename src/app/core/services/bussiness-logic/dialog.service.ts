import {EventEmitter, Injectable, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {reloadBrowser} from '../../utils/functions/functions';
import {Observable} from 'rxjs';
import {Invoice} from "@models/invoice.model";
import {DialogInvoiceComponent} from "@shared/components/dialog-invoice/dialog-invoice.component";
import {GenericAlertComponent} from "@shared/components/generic-alert/generic-alert.component";
import {DialogDeliveryComponent} from "@shared/components/dialog-delivery/dialog-delivery.component";
import {CalculatorDiscountComponent} from "@modules/home/component/calculator-discount/calculator-discount.component";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {
  CardComponentEditComponent
} from "@modules/home/component/list-menu/card-component-edit/card-component-edit.component";

import {Inventory} from "@models/inventory";
import {
  AddModiferGroupComponent
} from "@modules/home/component/list-modifiers-group/add-modifer-group/add-modifer-group.component";
import {IndividualConfig, ToastrService} from "ngx-toastr";
import {TypeToastrEnum} from "@core/utils/type.toastr.enum";
import {SchedulerAddComponent} from "@modules/home/component/list-scheduler/scheduler-add/scheduler-add.component";
import {
  AddUpdateProductOrderComponent
} from "@modules/home/component/add-update-product-order/add-update-product-order.component";
import {Product} from "@models/product.model";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  @Output() evResetEnableState = new EventEmitter<boolean>();

  constructor(
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {
  }

  openGenericInfo(title: string, content?: string, content2?: any, confirm?: boolean, disableClose?: boolean) {
    return confirm ? this.openGenericAlert(DialogType.DT_ERROR, title, content, content2, DialogConfirm.BTN_CONFIRM) :
      this.openGenericAlert(DialogType.DT_ERROR, title, content)
  }

  openDialogInvoices(inv: Invoice[], action: (i: any) => void, noSelectionMsg?: string, title?: string, subTitle?: string) {
    this.openDialogWithPag(inv, action, title, subTitle, 'receiptNumber', 'total', 'orderInfo', undefined,
      undefined /*this.configServ.sysConfig.breakText*/);
  }

  openDialogWithPag(dataArr: Array<any>, action: (i: any) => void, title?: string, subTitle?: string, label?: string,
                    detail?: string, subdetail?: string, noSelectionMsg?: string, breakText?: string) {
    if (dataArr.length > 0) {
      const dialogRef = this.dialog.open(DialogInvoiceComponent,
        {
          width: '780px', height: '680px',
          data: {
            invoice: dataArr, title: title, subtitle: subTitle, label: label, detail: detail, subdetail: subdetail,
            breakText: breakText
          },
          disableClose: true
        });
      dialogRef.afterClosed().subscribe((order: any) => {
        console.log('The dialog with pagination was closed', order);
        if (order) {
          action(order);
        } else {
          if (noSelectionMsg) {
            this.openGenericInfo('Error', noSelectionMsg);
          }
          // this.cashService.resetEnableState();
        }
      });
    } else {
      this.openGenericInfo('Information', 'There aren\'t elements to select');
      this.evResetEnableState.emit(true);
    }
  }

  openDialogWithPagObs(dataArr: Array<any>, title: string, subTitle: string, label: string,
                       detail?: string, subdetail?: string, noSelectionMsg?: string): Observable<any> {
    return this.dialog.open(DialogInvoiceComponent,
      {
        width: '780px', height: '680px',
        data: {invoice: dataArr, title: title, subtitle: subTitle, label: label, detail: detail, subdetail: subdetail},
        disableClose: true
      }).afterClosed();
  }

  openGenericAlert(dialogType: DialogType, title?: string, content?: string, content2?: any, confirm: DialogConfirm = DialogConfirm.BTN_CLOSE) {
    if (content!.trim().length === 0) return undefined;

    return this.dialog.open(GenericAlertComponent, {
      //width: '564px', height: '310px',
      //width: '464px', height: '290px',
      panelClass: "dialog-notification",
      data: {
        dialogType: dialogType,
        headerTitle: title ? title : 'Error',
        content: content,
        content2: content2,
        confirm: confirm,
      },
      disableClose: true
    });
  }

  openDialog(component: any, title: string, width?: string, height?: string, disableClose?: boolean, data?: any) {
    return this.dialog.open(component, {
      width: width ? width : '400px', height: height ? height : '210px', data, disableClose: disableClose
    });
  }

  genericOptionsModal(options: Array<{
    value: string,
    text: string
  }>, name: string, label?: string, width?: number, height?: number) {
    return this.dialog.open(DialogDeliveryComponent,
      {
        width: width ? width + 'px' : '600px', height: height ? height + 'px' : '360px',
        data: {name: name, label: 'Select an option', arr: options},
        disableClose: true
      });
  }


  /** Check if there is any dialog open  **/
  openDialogs() {
    return (this.dialog.openDialogs && this.dialog.openDialogs.length);
  }

  updateBrowser() {
    reloadBrowser();
  }

  openDialogCalculatorDiscount(maxValue: number) {
    return this.dialog.open(CalculatorDiscountComponent, {
      /*width: '550px', height: '680px',*/
      data: {
        titleCalculator: "Discount",
        isRefund: false,
        maxValue: maxValue,
        amountPayment: 0.00
      },
      disableClose: true
    }).afterClosed()
  }

  openDialogWait(title: string) {
    //return this.openDialog(ProgressSpinnerComponent, title, "289px", "316px");
    return this.dialog.open(ProgressSpinnerComponent, {
      width: '289px', height: '316px',
      data: {
        title: title ? title : 'Information',
      },
      disableClose: true
    });
  }

  dialogEditComponent(inventory: Inventory | Product) {
    return this.dialog.open(CardComponentEditComponent, {
      data: inventory,
      disableClose: true
    });
  }

  dialogAddModiferGroupComponent() {
    return this.dialog.open(AddModiferGroupComponent, {
      disableClose: true
    });

  }

  toastMessage(type: TypeToastrEnum, title?: string, message?: string,) {
    const toast = {
      message,
      title,
      type,
      ic: {
        timeOut: 2500,
        closeButton: true,
      } as IndividualConfig,
    };

    this.toastrService.show(
      toast.message,
      toast.title,
      toast.ic,
      'toast-' + toast.type
    );
  }

  openDialogAddSchedler() {
    return this.dialog.open(SchedulerAddComponent, {
      data: {},
      disableClose: true
    });
  }

  openDialogProduct(data: any) {
    return this.dialog.open(AddUpdateProductOrderComponent,
      {
        width: '745px', height: '760px',
        data: data,
        disableClose: true
      })
  }


}
