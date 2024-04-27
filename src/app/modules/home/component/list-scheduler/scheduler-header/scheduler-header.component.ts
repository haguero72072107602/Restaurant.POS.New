import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Scheduler} from "@models/scheduler.models";
import {DropdownComponentComponent} from "@modules/home/component/dropdown-component/dropdown-component.component";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import moment from "moment/moment";
import {DatePipe} from "@angular/common";
import dayjs from 'dayjs/esm';
import {getFormatOnlyDate, removeTFromISODate} from "@core/utils/functions/transformers";

declare var Datepicker: any;


@Component({
  selector: 'app-scheduler-header',
  standalone: true,
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownComponentComponent,
  ],
  templateUrl: './scheduler-header.component.html',
  styleUrl: './scheduler-header.component.css'
})
export class SchedulerHeaderComponent implements OnInit, AfterViewInit {

  @Input() scheduler?: Scheduler;

  beginDate: any;
  endDate: any;

  operations: any =
    [
      {id: "0", name: "Promotions"},
      {id: "1", name: "HappyHour"},
      {id: "2", name: "Star"},
    ];

  ngOnInit(): void {
    this.beginDate = this.scheduler?.beginDate ? this.scheduler?.beginDate : dayjs().format("MM-DD-YYYY");
    this.endDate = this.scheduler?.endDate ? this.scheduler?.endDate : dayjs().format("MM-DD-YYYY");
  }

  ngAfterViewInit(): void {
    const beginDatePickerEl = document.getElementById('beginDate');
    let fromDate = new Datepicker(beginDatePickerEl, {
      //title: 'Begin date',
      autohide: true,
      format: 'mm-dd-yyyy',
      language: 'en',
      onChange: (date: Date) => {
        console.log(date)
      }
    });

    beginDatePickerEl!.addEventListener('changeDate', (e: any) => {
      //const value = e.target.value;
      this.scheduler!.beginDate = e.target.value;
    });

    const endDatePickerEl = document.getElementById('endDate');
    new Datepicker(endDatePickerEl, {
      //title: 'End date',
      autohide: true,
      format: 'mm-dd-yyyy',
      language: 'en',
      onChange: (date: Date) => {
        console.log(date)
      }
    });

    endDatePickerEl!.addEventListener('changeDate', (e: any) => {
      //const value = e.target.value;
      this.scheduler!.endDate = e.target.value;
    });
  }

  changeBeginDate($event: any) {
    console.log(this.scheduler?.beginDate);
  }

  changeEndDate($event: any) {
    console.log(this.scheduler?.endDate);
  }
}
