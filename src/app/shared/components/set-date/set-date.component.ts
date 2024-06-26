import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {from} from "rxjs";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";

@Component({
  selector: 'app-set-date',
  templateUrl: './set-date.component.html',
  styleUrls: ['./set-date.component.scss']
})
export class SetDateComponent implements OnInit {

  title = "Set Date";
  subtitle = "Choose a date:";
  date = new Date();
  minDate = new Date(2020, 0, 1);
  maxDate = new Date();
  response: { lastClose: boolean, date: any } = {lastClose: false, date: undefined};

  constructor(
    public dialogRef: MatDialogRef<SetDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.title) this.title = data.title;
    if (data.subtitle) this.subtitle = data.subtitle;
  }

  ngOnInit() {
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('setDate addEvent', type, event.value);
    this.date = event.value!;
  }

  lastClose() {
    this.response.lastClose = true;
    this.dialogRef.close(this.response);
  }

  dateClose() {
    this.response.date = {};
    this.response.date['from'] = this.getFormatDate(new Date(this.date), true)!;
    this.response.date['to'] = this.getFormatDate(new Date(this.date), false);
    this.dialogRef.close(this.response);
  }

  dateTimeWorked() {
    this.dialogRef.close(this.getFormatOnlyDate(new Date(this.date)));
  }

  getFormatDate(date: Date, start?: boolean): string | undefined {
    return date.toISOString().split('T')[0] + ((start) ? ' 00:00:00' : ' 23:59:59');
  }

  getFormatOnlyDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

}
