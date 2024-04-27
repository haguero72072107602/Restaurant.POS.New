import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {Scheduler} from "@models/scheduler.models";
import {Time} from "@angular/common";
import {SchedulerTime} from "@models/scheduler-time.model";
import {
  SchedulerCardFrecuencyComponent
} from "@modules/home/component/list-scheduler/scheduler-card-frecuency/scheduler-card-frecuency.component";

@Component({
  selector: 'app-scheduler-frecuency',
  standalone: true,
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    MatInputModule,
    NgxDaterangepickerMd,
    FormsModule,
    SchedulerCardFrecuencyComponent
  ],
  templateUrl: './scheduler-frecuency.component.html',
  styleUrl: './scheduler-frecuency.component.css'
})
export class SchedulerFrecuencyComponent {

  @Input() scheduler?: Scheduler;
  @Output() evAddSchedulerTime = new EventEmitter<SchedulerTime>()
  @Output() evDeleteSchedulerTime = new EventEmitter<SchedulerTime>()

  operations: any = [
    {id: "0", name: "Days"},
    {id: "1", name: "Others"}
  ];

  itemsDay = [
    {title: "Monday", id: "0"},
    {title: "Tuesday", id: "1"},
    {title: "Wednesday", id: "2"},
    {title: "Thursday", id: "3"},
    {title: "Friday", id: "4"},
    {title: "Saturday", id: "5"},
    {title: "Sunday", id: "6"}
  ]
  timeFrom?: Time;
  timeTo?: Time;

  selectedDay(item: string, $event: any) {
  }

  fieldsChange($event: any) {
    console.log($event.target!.value)
  }

  addSchedulerTime() {
    console.log("Interval => ", this.timeFrom, "-", this.timeTo);
    if (this.timeFrom && this.timeTo) {
      const schedulerTime: Partial<SchedulerTime> =
        {
          fromTime: this.timeFrom,
          toTime: this.timeTo,
          schedulerId: this.scheduler?.id
        };
      this.evAddSchedulerTime.emit(schedulerTime as SchedulerTime)
    }
  }


  evSchedulerTimerDelete($event: SchedulerTime) {
    this.evDeleteSchedulerTime.emit($event)
  }
}
