import {Component, Input} from '@angular/core';
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Scheduler} from "@models/scheduler.models";

@Component({
  selector: 'app-scheduler-set-discount',
  standalone: true,
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './scheduler-set-discount.component.html',
  styleUrl: './scheduler-set-discount.component.css'
})
export class SchedulerSetDiscountComponent {

  @Input() scheduler?: Scheduler;

  operations: any = [
    {id: "0", name: "%"},
    {id: "1", name: "Price"}
  ];


}
