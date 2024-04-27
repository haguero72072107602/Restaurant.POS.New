import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SchedulerTime} from "@models/scheduler-time.model";
import {FormsModule} from "@angular/forms";
import {DatePipe, formatDate} from "@angular/common";

@Component({
  selector: 'app-scheduler-card-frecuency',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './scheduler-card-frecuency.component.html',
  styleUrl: './scheduler-card-frecuency.component.css'
})
export class SchedulerCardFrecuencyComponent {
  @Input() schedulerTimer?: SchedulerTime
  @Output() evSchedulerTimerDelete = new EventEmitter<SchedulerTime>();


  deleteShedulerTimer($event: SchedulerTime) {
    this.evSchedulerTimerDelete.emit($event);

    //const date : Date = this.schedulerTimer?.fromTime.;
    //formatDate(, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530')
  }

  deleteSchedulerTime() {
    this.evSchedulerTimerDelete.emit(this.schedulerTimer!);
  }
}
