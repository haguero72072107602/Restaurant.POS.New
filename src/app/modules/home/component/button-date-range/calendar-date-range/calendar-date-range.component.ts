import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MatCalendar,
  MatRangeDateSelectionModel,
} from '@angular/material/datepicker';
import {DateAdapter} from '@angular/material/core';
import {SharedModule} from "@shared/shared.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {presetsDateRange} from "@core/utils/operations/presetsDateRange";
import {FormsModule} from "@angular/forms";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {fnSetRangeDate} from "@core/utils/functions/functions";

@Component({
  selector: 'app-calendar-date-range',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
  ],
  templateUrl: './calendar-date-range.component.html',
  styleUrl: './calendar-date-range.component.css',
  providers: [DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel],

})
export class CalendarDateRangeComponent implements OnInit {

  @ViewChild('calendar', {static: true}) calendar: MatCalendar<Date> | undefined;
  @ViewChild('timeFrom', {static: true}) timeFrom!: ElementRef;
  @ViewChild('timeTo', {static: true}) timeTo!: ElementRef;

  // The selected date range.
  selectedDateRange: DateRange<Date> | undefined;
  maxDate: Date | undefined;
  protected readonly presetsDateRange = presetsDateRange;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CalendarDateRangeComponent>,
    private readonly selectionModel: MatRangeDateSelectionModel<Date>,
    private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>,
    private dateAdapter: DateAdapter<Date>,
  ) {
    this.maxDate = this.dateAdapter.today();
  }

  get getCheckData(): boolean {
    console.log()
    return (this.selectedDateRange?.start != null && this.selectedDateRange?.end != null) &&
      (this.getTimeTo!.length > 0 && this.getTimeFrom!.length > 0)
  }

  get getTimeFrom(): string {
    return this.timeFrom.nativeElement.value
  }

  get getTimeTo(): string {
    return this.timeTo.nativeElement.value
  }

  ngOnInit(): void {
    this.timeFrom.nativeElement.value = "00:00"
    this.timeTo.nativeElement.value = "23:59"
  }

  rangeChanged(selectedDate: Date) {
    if (!this.selectedDateRange?.start || this.selectedDateRange?.end) {
      this.selectedDateRange = new DateRange<Date>(selectedDate, null);
    } else {
      const start = this.selectedDateRange.start;
      const end = selectedDate;
      if (end < start) {
        this.selectedDateRange = new DateRange<Date>(end, start);
      } else {
        this.selectedDateRange = new DateRange<Date>(start, end);
      }
    }
  }

  // Selects a preset date range.
  selectPreset(presetDateRange: RangeDateOperation) {
    this.selectedDateRange = fnSetRangeDate(presetDateRange);

    // Jump into month of presetDateRange.start
    if (this.selectedDateRange.start && this.calendar)
      this.calendar._goToDateInView(this.selectedDateRange.end!, 'month');
  }

  onClose() {
    this.dialogRef.close()
  }

  onSubmit() {
    const strDateTimeFrom = this.selectedDateRange?.start?.toDateString() + ' ' + this.timeFrom.nativeElement.value
    const strDateTimeTo = this.selectedDateRange?.end?.toDateString() + ' ' + this.timeTo.nativeElement.value

    this.dialogRef.close({
      start: new Date(Date.parse(strDateTimeFrom)),
      end: new Date(Date.parse(strDateTimeTo))
    })
  }

}
