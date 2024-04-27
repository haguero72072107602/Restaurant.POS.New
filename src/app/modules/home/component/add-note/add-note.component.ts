import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css']
})
export class AddNoteComponent implements OnInit {
  @Input() note?: any;

  //formTable : any;

  constructor(private dialogRef: MatDialogRef<AddNoteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder) {
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
    console.log("note", this.note);
    this.dialogRef.close(this.note);
  }
}
