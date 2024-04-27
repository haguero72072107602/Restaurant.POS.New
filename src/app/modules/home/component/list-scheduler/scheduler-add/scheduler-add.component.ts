import {Component, Inject, signal} from '@angular/core';
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-scheduler-add',
  standalone: true,
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './scheduler-add.component.html',
  styleUrl: './scheduler-add.component.css'
})
export class SchedulerAddComponent {
  titleCode?: string;
  codeOperation?: string;
  private isPassword: boolean = false;

  constructor(private dialogRef: MatDialogRef<SchedulerAddComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.titleCode = data!.titleCode;
    this.isPassword = data!.titleCode;
  }

  onCancelDialog() {
    this.dialogRef.close();
  }

  onCloseDialog() {
    if (this.codeOperation?.trim().length! > 0) {
      this.dialogRef.close({result: true, codeOperation: this.codeOperation});
    }
  }

}
