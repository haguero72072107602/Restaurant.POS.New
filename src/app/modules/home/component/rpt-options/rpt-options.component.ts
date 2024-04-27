import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminOptionsService} from "@core/services/bussiness-logic/admin-options.service";
import {AdminOpEnum} from "@core/utils/operations/admin-op.enum";
import {SetDateComponent} from "@shared/components/set-date/set-date.component";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import {dateFormatter} from '@core/utils/functions/transformers';
import {ChartComponent} from "ng-apexcharts";
import {ChartOptions} from "@modules/home/component/rpt-resumen-operation/rpt-resumen-operation.component";
import {initFlowbite, initDropdowns} from 'flowbite'
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

declare var DateRangePicker: any;

@Component({
  selector: 'app-rpt-options',
  templateUrl: './rpt-options.component.html',
  styleUrls: ['./rpt-options.component.css']
})
export class RptOptionsComponent implements OnInit, AfterViewInit {

  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild("dateRangePicker", {static: false}) dateRangePicker!: ElementRef;
  public chartOptions?: ChartOptions;

  selectedOption?: number = 1;
  public progressCloseShift: boolean = false;

  public startdate: any;
  public enddate: any;

  constructor(private activeRouter: ActivatedRoute,
              private router: Router,
              private adminOpService: AdminOptionsService,
              private operationService: OperationsService,
              private cashService: CashService
  ) {
  }

  ngAfterViewInit(): void {
    initFlowbite();
    new DateRangePicker(this.dateRangePicker!.nativeElement, {});
  }

  ngOnInit(): void {
    //this.activeRouter.params.subscribe( (param : any) =>{
    //  this.selectedOption = param["selectparameter"];
    //});
    //this.ngAfterViewInit();
  }


  onCloseShift($event: any) {
    try {
      this.progressCloseShift = true;
      this.cashService.dialog.open(SetDateComponent,
        {
          width: '400px', height: '280px', data: {title: 'Close Day', subtitle: '', closeDay: true},
          disableClose: true
        })
        .afterClosed().subscribe((next: any) => {
        console.log('afterCloseSetDate', next);
        if (next.lastClose) {
          this.adminOpService.dayCloseType(undefined, AdminOpEnum.WTDZ, $event);
        }
        if (next.date) {
          this.adminOpService.dayCloseType(undefined, AdminOpEnum.WTDZ, $event, next.date);
        }
      });
    } finally {
      this.progressCloseShift = false;
    }
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log('setDate addEvent', type, event.value);
    if (type == 'start') {
      this.startdate = dateFormatter(event.value!).split(',')[0];
    } else {
      this.enddate! = dateFormatter(event.value!).split(',')[0];

    }
    console.log(this.startdate);
    console.log(this.enddate);
  }

  onFinancial() {
    console.log(this.getFormatDate(this.startdate, true));
    console.log(this.getFormatDate(this.enddate, false));

    this.router.navigate(["/home/layout/reports/financial",
      {startdate: this.getFormatDate(this.startdate, true), enddate: this.getFormatDate(this.enddate, false)}]);
  }

  getFormatDate(date: string, start?: boolean): string | undefined {
    return date + ((start) ? ' 00:00:00' : ' 23:59:59');
  }
}
