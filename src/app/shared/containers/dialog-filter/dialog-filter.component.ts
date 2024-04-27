import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FilterComponent} from "@shared/components/filter/filter.component";

@Component({
  selector: 'app-dialog-filter',
  templateUrl: './dialog-filter.component.html',
  styleUrls: ['./dialog-filter.component.scss']
})
export class DialogFilterComponent implements OnInit {
  @Input() title = 'Filter';

  constructor(public dialogRef: MatDialogRef<FilterComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    if (this.data && this.data.title) {
      this.title = this.data.title;
    }
  }

  closeDialog(text: string) {
    this.dialogRef.close({text: text});
  }

}
