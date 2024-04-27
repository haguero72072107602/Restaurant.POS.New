import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {NgClass} from "@angular/common";
import {Scheduler} from "@models/scheduler.models";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Component({
  selector: 'app-scheduler-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './scheduler-card.component.html',
  styleUrl: './scheduler-card.component.css'
})
export class SchedulerCardComponent {

  @Input({required: true}) scheduler?: Scheduler;
  @Output() evSelectedScheduler = new EventEmitter<Scheduler>()
  @Output() evDeletedScheduler = new EventEmitter<Scheduler>()
  @Output() evStateScheduler = new EventEmitter<Scheduler>()

  constructor(public searchService: SearchService) {
  }

  getSelectScheduler() {
    return this.scheduler?.schedulerType === SchedulerType.Promotion
      ? this.searchService.selectedSchedulerPromotion :
      this.scheduler?.schedulerType === SchedulerType.HappyHour
        ? this.searchService.selectedSchedulerHappyHour :
        this.scheduler?.schedulerType === SchedulerType.ByTime
          ? this.searchService.selectedSchedulerByTime : '-99';
  }

  deleteScheduler() {
    this.evDeletedScheduler.emit(this.scheduler)
  }

  changeStateScheduler() {
    this.scheduler!.isActive = !this.scheduler!.isActive;
    this.evStateScheduler.emit(this.scheduler)
  }

  editScheduler() {
    switch (this.scheduler?.schedulerType) {
      case 0:
        this.searchService.selectedSchedulerPromotion = this.scheduler?.id!
        break;
      default:
        this.searchService.selectedSchedulerHappyHour = this.scheduler?.id!
        break;
    }
    console.log(this.scheduler);
    this.evSelectedScheduler.emit(this.scheduler);
  }
}
