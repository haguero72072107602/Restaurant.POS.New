import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Table} from "@models/table.model";

@Component({
  selector: 'app-add-table',
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.css']
})
export class AddTableComponent implements OnInit {

  countChairs?: number = 0;
  formTable: any;

  constructor(private dialogRef: MatDialogRef<AddTableComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.formTable = this.fb.group({
      number: ['', Validators.required],
      label: [''],
      chairs: [0, Validators.max(30)]
    });
  }

  onClose() {
    this.dialogRef.close()
  }

  onMinus() {
    if (this.countChairs! > 0) {
      this.countChairs!--;
      this.formTable?.get("chairs")!.setValue(this.countChairs!);
    }
  }

  onPlus() {
    this.countChairs!++;
    this.formTable?.get("chairs")!.setValue(this.countChairs!);
  }


  onSubmit(formTable: FormGroup) {
    if (formTable.valid) {
      const table: Partial<Table> =
        {
          label: formTable.get("label")?.value,
          number: formTable.get("number")?.value,
          chairNumber: formTable.get("chairs")?.value,
        }
      this.dialogRef.close(table)
    }
  }
}
