import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Theme} from 'src/app/models/theme';
import {DataStorageService} from "@core/services/api/data-storage.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {dateFormatter, removeTFromISODate} from "@core/utils/functions/transformers";
import {InformationType} from "@core/utils/information-type.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-range-date',
  templateUrl: './range-date.component.html',
  styleUrls: ['./range-date.component.scss']
})
export class RangeDateComponent implements OnInit {
  title = 'Range Date';
  subtitle = 'Choose a date:';
  startdate: any;
  enddate: any;
  startClose: any;
  endClose: any;
  minDate = new Date(2020, 0, 1);
  maxDate = new Date();
  minEndDate? = new Date(2020, 0, 1);
  maxStartDate? = new Date();
  response = {startCloseDate: '', endCloseDate: ''};
  enddisabled: boolean = true;
  btnDisabled: boolean = true;
  showingCloseReports: boolean = false;
  rangeReportType?: 'close' | 'date';
  startTime: string = '00:00';
  endTime: string = '23:59';

  theme: string = this.th.theme;

  constructor(private th: Theme,
              public dialogRef: MatDialogRef<RangeDateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogService: DialogService,
              private dataStorage: DataStorageService, private operationService: OperationsService,
              private cashService: CashService) {
    if (data.title) {
      this.title = data.title;
    }
    if (data.subtitle) {
      this.subtitle = data.subtitle;
    }
    if (data.type) {
      this.rangeReportType = data.type;
    }
    this.startdate = (data.cleanDate) ? '' : new Intl.DateTimeFormat('en-US').format(new Date());
    this.enddate = (data.cleanDate) ? '' : new Intl.DateTimeFormat('en-US').format(new Date());
  }

  ngOnInit() {
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('setDate addEvent', type, event.value);
    this.showingCloseReports = true;
    if (type === 'start') {
      this.startdate = event.value;
      this.enddisabled = false;
      this.minEndDate = event.value!;
      if (this.rangeReportType === "close") this.showCloseReports(this.startdate, true);
    } else {
      this.enddate = event.value;
      this.maxStartDate = event.value!;
      this.rangeReportType === "close" ? this.showCloseReports(this.enddate, false) : this.btnDisabled = false;
    }
  }

  closeDatePickerEvent(start: boolean) {
    if (!this.showingCloseReports) {
      const date = start ? this.startdate : this.enddate;
      this.showCloseReports(date, start);
    }
  }

  showCloseReports(date: any, start: boolean) {
    //const closeReports = new Array<any>({value: '1000', date: date+'-12:00'});
    const from = this.getFormatDate(new Date(date), true);
    const to = this.getFormatDate(new Date(date), false);
    this.dataStorage.getCloseReportsByDate(from, to).subscribe(
      next => {
        console.log(next);
        this.showingCloseReports = false;
        const closeReports = next.map((close: any) => new Object({
          total: close.saleTax + '',
          range: dateFormatter(close.openingTime) + ' - ' + dateFormatter(close.closeTime),
          id: close.id,
          date: start ? close.openingTime : close.closeTime,
        }));
        this.operationService.openDialogWithPag(closeReports,
          (e) => this.selectedCloseReport(e, start), 'Close reports',
          'Select a close report:', 'date', 'total', '', '', 40);
      },
      error => this.dialogService.openGenericInfo(InformationType.ERROR, error)
    );
    /*this.operationService.openDialogWithPag(closeReports, (e) => this.selectedCloseReport(e, start), 'Close reports',
        'Select a close report:', 'date', 'value');*/
  }

  selectedCloseReport(report: any, start: boolean) {
    console.log('selectedCloseReport', report, start);
    if (report) {
      if (start) {
        this.startClose = report;
      } else {
        this.endClose = report;
        this.btnDisabled = false;
      }
    }
  }

  getCloseReport() {
    if (this.rangeReportType === 'close') {
      this.response.startCloseDate = this.startClose.date;
      this.response.endCloseDate = this.endClose.date;
    } else {
      console.log('getCloseReportByDate', this.startdate, this.startTime, this.enddate, this.endTime);
      let start = new Date(this.startdate);
      let end = new Date(this.enddate);
      this.response.startCloseDate = removeTFromISODate(this.getISODateInLocale(this.setTime(this.startTime, true, start)));
      this.response.endCloseDate = removeTFromISODate(this.getISODateInLocale(this.setTime(this.endTime, false, end)));
      console.log('getCloseReportByDate', start, end, this.response);
    }
    this.dialogRef.close(this.response);
  }

  getTimeInMiliseconds(time: string, start: boolean) {
    const splittedTime = time.split(":");
    let ms = Number(splittedTime[0]) * 60 * 60 * 1000 +
      Number(splittedTime[1]) * 60 * 1000 +
      Number(start ? 0 : 59) * 1000;
    return ms;
  }

  setTime(time: string, start: boolean, date: Date): Date {
    const splittedTime = time.split(":").map(val => +val);
    date.setHours(splittedTime[0], splittedTime[1], Number(start ? 0 : 59));
    return date;
  }

  getISODateInLocale(date: Date): string {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
  }

  getFormatDate(date: Date, start?: boolean) {
    return date.toISOString().split('T')[0] + ((start) ? ' 00:00:00' : ' 23:59:59');
  }

  getFormatOnlyDate(date: Date) {
    return date.toISOString().split('T')[0];
  }

}
