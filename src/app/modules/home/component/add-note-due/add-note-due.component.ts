import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note-due.component.html',
  styleUrls: ['./add-note-due.component.css']
})
export class AddNoteDueComponent implements OnInit {
  @Input() notePrepared?: any;
  @Input() noteInvoice?: any;
  selectPrint: number = 1;

  //formTable : any;
  protected readonly onchange = onchange;

  constructor(private dialogRef: MatDialogRef<AddNoteDueComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
    this.noteInvoice = data!.noteInvoice;
    this.notePrepared = data!.notePrepared;
  }

  get enableButtonOk() {
    return this.selectPrint != -1
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    /*
    this.formTable = this.fb.group({
      number: ['', Validators.required],
      label: ['', [Validators.required,Validators.max(5)]],
      chairs: [0, [Validators.min(0), Validators.max(30)]]
    });
    */
  }

  onSubmit() {
    this.dialogRef
      .close({
        selected: this.selectPrint,
        noteInvoice: this.noteInvoice, notePrepared: this.notePrepared
      });
  }

  onchangeRadio(selectPrint: number) {
    console.log(selectPrint);
    this.selectPrint = selectPrint;





  }
}
