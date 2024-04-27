import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SchedulerTime} from "@models/scheduler-time.model";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {Scheduler} from "@models/scheduler.models";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Component({
  selector: 'app-scheduler-card-product',
  standalone: true,
  imports: [],
  templateUrl: './scheduler-card-product.component.html',
  styleUrl: './scheduler-card-product.component.css'
})
export class SchedulerCardProductComponent implements OnInit {

  @Input() schedulerProduct?: SchedulerProduct;
  @Input() scheduler?: Scheduler;
  @Output() evDeleteSchedulerProduct = new EventEmitter<SchedulerProduct>();
  protected readonly SchedulerType = SchedulerType;

  ngOnInit(): void {
    console.log("scheduler active", this.scheduler);
  }

  deleteSchedulerProduct() {
    this.evDeleteSchedulerProduct.emit(this.schedulerProduct);
  }
}
