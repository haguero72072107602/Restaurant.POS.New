import {Component, OnInit, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.css']
})
export class CashPaymentComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CashPaymentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.close) {
      setTimeout(() => this.onPrint(true), 20000);
    }
  }

  ngOnInit() {
  }

  onPrint(closeAutomatic?: boolean) {
    this.data.closeAutomatic = closeAutomatic;
    console.log(this.data);
    this.dialogRef.close(this.data);
  }

}
