import {Component, Inject} from '@angular/core';
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-modifer-group',
  standalone: true,
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-modifer-group.component.html',
  styleUrl: './add-modifer-group.component.css'
})
export class AddModiferGroupComponent {

  modifierGroup: any;

  constructor(private dialogRef: MatDialogRef<AddModiferGroupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
  }

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log("note", this.modifierGroup);
    this.dialogRef.close(this.modifierGroup);
  }


}
