import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild,} from '@angular/core';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {
  CalendarDateRangeComponent
} from "@modules/home/component/button-date-range/calendar-date-range/calendar-date-range.component";
import {DateRange} from "@angular/material/datepicker";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import moment from "moment";
import {fnSetRangeDate} from "@core/utils/functions/functions";

@Component({
  selector: 'app-button-date-range',
  standalone: true,
  imports: [
    CalendarDateRangeComponent,
    //PortalModule
  ],
  templateUrl: './button-date-range.component.html',
  styleUrl: './button-date-range.component.css'
})
export class ButtonDateRangeComponent implements OnInit {

  @ViewChild("inputDateRange", {static: true}) inputDateRange!: ElementRef<HTMLInputElement>
  //@ViewChild('ratingModal') ratingModal!: TemplatePortal<any>;

  @Output() onChangeDate = new EventEmitter<DateRange<Date>>();
  @Input({required: true}) dateRange: RangeDateOperation = RangeDateOperation.ThisMonth;
  @Input({required: true}) emitInitialRange: boolean = false;

  @Input() dateRangeReference: DateRange<Date> | undefined = undefined;


  dateSelected: DateRange<Date> | undefined;

  constructor(
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {

    //debugger;
    if (this.dateRangeReference) {
      this.dateSelected = this.dateRangeReference
    } else {
      this.dateSelected = fnSetRangeDate(this.dateRange);
      this.dateSelected = new DateRange(
        new Date(Date.parse(this.dateSelected.start?.toDateString() + ' 00:00')),
        new Date(Date.parse(this.dateSelected.end?.toDateString() + ' 23:59')))
    }

    this.updateRangeDate();
    if (this.emitInitialRange) this.setEventChangeDtaRange();
  }

  openDialog() {
    this.dialogService.openDialog(CalendarDateRangeComponent, "", "600px", "600px", true,
      {range: this.dateRange, initChange: this.emitInitialRange})
      .afterClosed().subscribe((value: DateRange<Date>) => {
      if (value) {
        this.dateSelected = new DateRange<Date>(value.start, value.end);
        this.updateRangeDate();
        this.setEventChangeDtaRange();
      }
    });
  }

  updateRangeDate() {
    this.inputDateRange.nativeElement.value =
      this.format(this.dateSelected!.start!) + " - " + this.format(this.dateSelected!.end!)
  }

  format(date: Date): string {
    return moment(date).format("MM-DD-yyyy HH:mm")
  }

  setEventChangeDtaRange() {
    this.onChangeDate.emit(this.dateSelected)
  }

}

