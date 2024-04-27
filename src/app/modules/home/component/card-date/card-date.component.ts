import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import moment from "moment";
import {DateAdapter} from "@angular/material/core";

declare var Datepicker: any;

@Component({
  selector: 'app-card-date',
  templateUrl: './card-date.component.html',
  styleUrls: ['./card-date.component.css']
})
export class CardDateComponent implements AfterViewInit {
  dateSelected?: Date;
  maxDate: Date = new Date();
  titleCard: string;

  constructor(
    //private dateAdapter: DateAdapter<Date>,
    private dialogRef: MatDialogRef<CardDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: DialogService
  ) {
    this.titleCard = data!.title;
    //this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngAfterViewInit(): void {
    /*
    const datepickerEl = document.getElementById('datePicker');
    new Datepicker(datepickerEl, {
      // options
    });
    */
    //this.dateSelected = new Date();
  }

  onClose() {
    this.dialogRef.close()
  }

  onPrint() {
    if (this.dateSelected) {
      const formattedDate = moment(this.dateSelected).format("MM-DD-YYYY");
      this.dialogRef.close({day: formattedDate, closeDay: false})
    }
  }

  OnCloseDay() {
    if (this.dateSelected) {
      const formattedDate = moment(this.dateSelected).format("MM-DD-YYYY");
      this.dialogRef.close({day: formattedDate, closeDay: true})
    }
  }

  onCancel() {
    this.onClose()
  }


}
