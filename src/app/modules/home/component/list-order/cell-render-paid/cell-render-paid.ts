import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from 'ag-grid-community';
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {Router} from "@angular/router";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {Invoice} from "@models/invoice.model";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";


@Component({
  standalone: true,
  selector: 'app-buttons-cell-render',
  templateUrl: './cell-render-paid.html',
  styleUrls: ['./cell-render-paid.css']
})
export class CellRenderPaid extends AbstractInstanceClass implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  status: number = 0;
  receiptNumber: undefined | string;

  invoice!: Invoice;

  constructor(private invoiceService: InvoiceService,
              private operationService: OperationsService,
              private tableService: TablesService,
              private dialogService: DialogService,
              private dialog: MatDialog,
              private router: Router) {
    super();
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.status = this.params!.data!.status;
    this.receiptNumber = this.params!.data!.receiptNumber;
    this.invoice = (this.params!.data as Invoice);

  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  writeMethodPaid(): string {
    if (this.invoice.payments?.length > 0) {
      let strPaid: string = "";
      this.invoice.payments?.map((i: any) => {
        switch (i.paymentMethod) {
          case PaymentMethodEnum.CASH :
            strPaid += " Cash";
            break;
          case PaymentMethodEnum.CREDIT_CARD :
            strPaid += " Credit card";
            break;
          case PaymentMethodEnum.DEBIT_CARD :
            strPaid += " Debit card";
            break;
          case PaymentMethodEnum.EBT_CARD :
            strPaid += " EBT card";
            break;
          case PaymentMethodEnum.OTHER :
            strPaid += " Other";
            break;
          case PaymentMethodEnum.EBT_CASH :
            strPaid += " EBT Cash";
            break;
          case PaymentMethodEnum.ACCOUNT_CHARGE :
            strPaid += " Account";
            break;
          case PaymentMethodEnum.CHECK :
            strPaid += " Check";
            break;
          case PaymentMethodEnum.TRANSFER :
            strPaid += " Transfer";
            break;
          case PaymentMethodEnum.GIFT_CARD :
            strPaid += " GIFT Card";
            break;
          case PaymentMethodEnum.Online :
            strPaid += " Online";
            break;
        }
      })
      return strPaid
    } else {
      return "";
    }
  }

}
