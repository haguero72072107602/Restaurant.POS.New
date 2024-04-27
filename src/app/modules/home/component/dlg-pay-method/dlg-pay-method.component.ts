import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";
import {values} from "ag-grid-community/dist/types/core/utils/generic";

@Component({
  selector: 'app-dlg-pay-method',
  standalone: true,
  imports: [],
  templateUrl: './dlg-pay-method.component.html',
  styleUrl: './dlg-pay-method.component.css'
})
export class DlgPayMethodComponent {

  paymentMethod: PaymentMethodEnum = PaymentMethodEnum.CASH;
  protected readonly PaymentMethodEnum = PaymentMethodEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DlgPayMethodComponent>
  ) {
    this.paymentMethod = data.paymentMethod;
  }

  onClose() {
    this.dialogRef.close()
  }
}
