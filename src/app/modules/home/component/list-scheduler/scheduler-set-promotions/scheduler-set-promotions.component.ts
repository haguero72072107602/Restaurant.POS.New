import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Scheduler} from "@models/scheduler.models";

@Component({
  selector: 'app-scheduler-set-promotions',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './scheduler-set-promotions.component.html',
  styleUrl: './scheduler-set-promotions.component.css'
})
export class SchedulerSetPromotionsComponent {
  @Input() scheduler?: Scheduler;

}
