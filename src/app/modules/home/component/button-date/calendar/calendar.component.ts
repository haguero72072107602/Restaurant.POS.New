import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {DateRange} from "@angular/material/datepicker";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {

  selected!: DateRange<Date>;

  @Output() evChangeDate = new EventEmitter<Date>()

  @Input() dateValue!: Date;

  dateChanged($event: Date | null) {
    this.evChangeDate.emit($event!)
  }

  ngOnInit(): void {
    if (this.dateValue) {
      //this.selected = new DateRange( new Date( Date.parse(this.dateValue)), new Date( Date.parse(this.dateValue)) );
      //console.log("Date active", this.selected);
    }
  }

}
