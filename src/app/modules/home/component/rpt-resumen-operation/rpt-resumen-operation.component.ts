import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {initFlowbite, initDropdowns} from 'flowbite'
import {Dropdown} from "flowbite";
import type {DropdownOptions, DropdownInterface} from "flowbite";

declare var Datepicker: any;
declare var DateRangePicker: any;


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from "ng-apexcharts";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-rpt-resumen-operation',
  templateUrl: './rpt-resumen-operation.component.html',
  styleUrls: ['./rpt-resumen-operation.component.css']
})
export class RptResumenOperationComponent implements AfterViewInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;

  constructor(
    private operationService: OperationsService
  ) {
    initFlowbite();
    initDropdowns();

    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };
  }

  ngAfterViewInit(): void {
    /*
    const datepicker = document.getElementById("floating_standard");
    new Datepicker(datepicker, {
      format:"dd/mm/yyyy",
      autohide: true
    });
    */

    const dateRangePickerEl = document.getElementById('dateRangePickerId');
    new DateRangePicker(dateRangePickerEl, {
      // options
    });

    // set the dropdown menu element
    const targetEl: HTMLElement | null = document.getElementById('dropdownHelper');

    // set the element that trigger the dropdown menu on click
    const triggerEl: HTMLElement | null = document.getElementById('dropdownHelperButton');

// options with default values
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,
      onHide: () => {
        console.log('dropdown has been hidden');
      },
      onShow: () => {
        console.log('dropdown has been shown');
      },
      onToggle: () => {
        console.log('dropdown has been toggled');
      }
    };

    /*
    * targetEl: required
    * triggerEl: required
    * options: optional
    */
    const dropdown: DropdownInterface = new Dropdown(targetEl, triggerEl, options);
  }

}
