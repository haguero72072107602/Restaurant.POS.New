import {Component, OnInit} from '@angular/core';
import {AgGridModule} from "ag-grid-angular";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {SchedulerCardComponent} from "@modules/home/component/list-scheduler/scheduler-card/scheduler-card.component";
import {
  SchedulerHeaderComponent
} from "@modules/home/component/list-scheduler/scheduler-header/scheduler-header.component";
import {
  SchedulerFrecuencyComponent
} from "@modules/home/component/list-scheduler/scheduler-frecuency/scheduler-frecuency.component";
import {
  SchedulerSetDiscountComponent
} from "@modules/home/component/list-scheduler/scheduler-set-discount/scheduler-set-discount.component";
import {NgClass} from "@angular/common";
import {SchedulerService} from "@core/services/bussiness-logic/scheduler.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {Scheduler} from "@models/scheduler.models";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {ProgressCircleComponent} from "@modules/home/component/progress-circle/progress-circle.component";
import {SchedulerTime} from "@models/scheduler-time.model";
import {
  SchedulerDropdownProductsComponent
} from "@modules/home/component/list-scheduler/scheduler-dropdown-products/scheduler-dropdown-products.component";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {ActivatedRoute} from "@angular/router";
import {
  SchedulerSetPromotionsComponent
} from "@modules/home/component/list-scheduler/scheduler-set-promotions/scheduler-set-promotions.component";
import {TypeToastrEnum} from "@core/utils/type.toastr.enum";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Component({
  selector: 'app-list-scheduler',
  standalone: true,
  imports: [
    AgGridModule,
    FormsModule,
    MatInputModule,
    NgxDaterangepickerMd,
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    SchedulerCardComponent,
    SchedulerHeaderComponent,
    SchedulerFrecuencyComponent,
    SchedulerSetDiscountComponent,
    NgClass,
    ProgressCircleComponent,
    SchedulerDropdownProductsComponent,
    SchedulerSetPromotionsComponent
  ],
  templateUrl: './list-scheduler.component.html',
  styleUrl: './list-scheduler.component.css'
})
export class ListSchedulerComponent implements OnInit {

  selectedSheduler?: Scheduler;
  optionSelected: number = 0;
  loadingScheduler: boolean = false;
  schedulerList: Scheduler[] = [];
  moduleActive: SchedulerType = SchedulerType.All;

  schedulerActive?: Partial<Scheduler> = {
    "name": "",
    "monday": true,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": true,
    "saturday": true,
    "sunday": true,
    "schedulerFrequency": 1,
    "schedulerType": 0,
    "schedulerApplyTo": 0,
    "schedulerDiscountType": 0,
    "isActive": false,
    "quantity": 0,
    "price": 0
  }

  schedulerForm: FormGroup | undefined;
  isNewScreduler: boolean = true;
  protected readonly SchedulerType = SchedulerType;

  constructor(
    private schedulerService: SchedulerService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    public searchService: SearchService,
    private activeRouter: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.onInitForm();
    this.activeRouter.paramMap.subscribe(params => {
      console.log(params);
      this.moduleActive = Number(params.get("id")) as SchedulerType;

      console.log('scheduler active ->', this.moduleActive);

      this.readSchedulerData(this.moduleActive);
    });

  }

  onInitForm() {
    this.schedulerForm = this.fb.group({
      "name": new FormControl("", [Validators.required]),
      "monday": new FormControl(true, [Validators.required]),
      "tuesday": new FormControl(true, [Validators.required]),
      "wednesday": new FormControl(true, [Validators.required]),
      "thursday": new FormControl(true, [Validators.required]),
      "friday": new FormControl(true, [Validators.required]),
      "saturday": new FormControl(true, [Validators.required]),
      "sunday": new FormControl(true, [Validators.required]),
      "schedulerFrequency": new FormControl(1, [Validators.required]),
      "schedulerType": new FormControl(0, [Validators.required]),
      "schedulerApplyTo": new FormControl(0, [Validators.required]),
      "schedulerDiscountType": new FormControl(0, [Validators.required]),
      "isActive": new FormControl(true, [Validators.required]),
      "quantity": new FormControl(0, [Validators.required]),
      "price": new FormControl(0, [Validators.required]),
    });
  }

  errorMessageBox(error: any) {
    this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
  }

  /* Event scheduler */
  evDeletedScheduler($event: Scheduler) {
    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Question", "You want to delete the scheduled task",
      undefined, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
      if (next) {
        this.loadingScheduler = true;
        this.schedulerService.deleteScheduler($event.id).subscribe((next: Scheduler[]) => {
          console.log("delete scheduler", next);
          this.schedulerList = this.schedulerList.filter(s => s.id != $event.id)
          this.loadingScheduler = false;
          if ($event === this.selectedSheduler) this.selectedSheduler = undefined;
        }, error => {
          this.loadingScheduler = false;
          this.errorMessageBox(error)
        })
      }
    });
  }

  evStateScheduler($event: Scheduler) {
    if ($event.schedulerType === SchedulerType.Promotion) {
      $event.schedulerDiscountType = 2;
    }

    this.schedulerService.updateScheduler($event).subscribe((next: Scheduler[]) => {
      console.log("Update scheduler ->", next);
      this.dialogService.toastMessage(TypeToastrEnum.INFO, "Update scheduler...");
      this.schedulerList = next;
    }, error => {
      this.errorMessageBox(error)
    })
  }

  evSelectedSchedure($event?: Scheduler) {
    this.selectedSheduler = $event;
    if ($event) {
      switch (this.moduleActive) {
        case SchedulerType.Promotion:
          this.searchService.selectedSchedulerPromotion = $event!.id
          break
        case SchedulerType.HappyHour:
          this.searchService.selectedSchedulerHappyHour = $event!.id
          break
        case SchedulerType.ByTime:
          this.searchService.selectedSchedulerByTime = $event!.id
          break
      }
    }
  }

  selectOptionButton(value: number) {
    this.optionSelected = value
  }

  readSchedulerData(activeModule: SchedulerType) {
    this.loadingScheduler = true;
    this.schedulerService.getScheduler(activeModule).subscribe((next: Scheduler[]) => {
      console.log("scheduler ", next);
      this.schedulerList = [];
      this.schedulerList.push(...next);
      this.evSelectedSchedure(undefined);
      switch (this.moduleActive) {
        case SchedulerType.Promotion:
          if (this.searchService.selectedSchedulerPromotion != '-99') {
            const scheduler = this.schedulerList.filter(p => p.id === this.searchService.selectedSchedulerPromotion)[0];
            this.evSelectedSchedure(scheduler);
          }
          break
        case SchedulerType.HappyHour:
          if (this.searchService.selectedSchedulerHappyHour != '-99') {
            const scheduler = this.schedulerList.filter(p => p.id === this.searchService.selectedSchedulerHappyHour)[0];
            this.evSelectedSchedure(scheduler);
          }
          break
        case SchedulerType.ByTime:
          if (this.searchService.selectedSchedulerByTime != '-99') {
            const scheduler = this.schedulerList.filter(p => p.id === this.searchService.selectedSchedulerByTime)[0];
            this.evSelectedSchedure(scheduler);
          }
          break
      }
      this.loadingScheduler = false;
    }, error => {
      this.loadingScheduler = false;
      this.errorMessageBox(error)
    })
  }

  addScheduler() {
    this.dialogService.openDialogAddSchedler().afterClosed().subscribe((next: any) => {
      if (next) {
        this.schedulerActive!.name = next.codeOperation;
        this.schedulerActive!.schedulerType = this.moduleActive;
        this.schedulerService.createScreduler(this.schedulerActive as Scheduler).subscribe((next: Scheduler) => {
          console.log('add sheduler ->', next);
          this.schedulerList.push(next);
        }, error => {
          this.errorMessageBox(error)
        })
      }
    });
  }

  saveScheduler() {
    this.evStateScheduler(this.selectedSheduler!);
  }

  evAddSchedulerTime($event: SchedulerTime) {
    console.log($event);
    this.schedulerService.createScredulerTime($event).subscribe((next: Scheduler) => {
      console.log('add sheduler ->', next);
      this.selectedSheduler = next;
    }, error => {
      this.errorMessageBox(error)
    })
  }

  evDeleteSchedulerTime($event: SchedulerTime) {
    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Question", "You want to delete the scheduled time",
      undefined, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
      if (next) {
        this.schedulerService.deleteSchedulerTime($event).subscribe((next: Scheduler) => {
          console.log("delete scheduler", next);
          this.selectedSheduler = next;
        }, error => {
          this.errorMessageBox(error)
        })
      }
    });

  }

  evSchedulerAddProduct($event: SchedulerProduct) {
    this.schedulerService.addSchedulerProduct($event).subscribe((next: Scheduler) => {
      console.log("delete scheduler", next);
      this.selectedSheduler = next;
    }, error => {
      this.errorMessageBox(error)
    })

  }

  evSchedulerDelProduct($event: SchedulerProduct) {
    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Question", "You want to delete the scheduled" +
      " product",
      undefined, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
      if (next) {
        this.schedulerService.deleteSchedulerProduct($event).subscribe((next: Scheduler) => {
          console.log("delete scheduler", next);
          this.selectedSheduler = next;
        }, error => {
          this.errorMessageBox(error)
        })
      }
    });
  }
}
