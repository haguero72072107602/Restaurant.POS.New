import {Component, Inject, OnInit} from '@angular/core';
import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-confirm-payment',
  standalone: true,
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './confirm-payment.component.html',
  styleUrl: './confirm-payment.component.css'
})
export class ConfirmPaymentComponent implements OnInit {

  dataGroup: any;
  protected readonly PaymentMethodEnum = PaymentMethodEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmPaymentComponent>,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.dataGroup = this.formBuilder.group({
      codeOperation: new FormControl(null, [Validators.required, Validators.min(5)]),
    });
  }

  onClose() {
    this.dialogRef.close()
  }

  onCancelDialog() {
    this.onClose()
  }

  onSubmit($event: any) {
    this.dialogRef.close(this.dataGroup.get("codeOperation")?.value)
  }
}
