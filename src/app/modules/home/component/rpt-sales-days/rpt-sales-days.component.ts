import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexGrid
} from "ng-apexcharts";
import {initFlowbite} from "flowbite";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {FinancialDaily} from "@models/financials";
import {pipe} from "rxjs";
import {map} from "rxjs/operators";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};

declare var DateRangePicker: any;

@Component({
  selector: 'app-rpt-sales-days',
  templateUrl: './rpt-sales-days.component.html',
  styleUrls: ['./rpt-sales-days.component.css']
})
export class RptSalesDaysComponent implements AfterViewInit, OnInit {

  @ViewChild("dateRangePicker", {static: false}) dateRangePicker!: ElementRef;
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions?: Partial<ChartOptions>;


  constructor(
    private operationService: OperationsService,
    private reportsService: ReportsService,
    private dialogService: DialogService,
    private datePipe?: DatePipe,
  ) {
  }

  ngOnInit(): void {

    this.chartOptions = {
      series: [],
      chart: {
        width: "100%",
        height: "100%",
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          /*
          "South Korea",
          "Canada",
          "United Kingdom",
          "Netherlands",
          "Italy",
          "France",
          "Japan",
          "United States",
          "China",
          "Germany"
          */
        ]
      }
    };
  }

  ngAfterViewInit(): void {
    initFlowbite();
    const dateRangePickerEl = document.getElementById('dateRangePickerId');
    new DateRangePicker(this.dateRangePicker!.nativeElement, {
      // options
      autohide: true,
      format: 'dd/mm/yyyy',
      maxDate: new Date()
    });
  }

  onChangeGroup($event: Event) {

  }

  onExecReport() {
    let dataValue: number[] = [];
    let dataLabel: string[] = []

    this.reportsService
      .getFinancialDaily("09/01/2023", "09/30/2023")
      .pipe(map((next: FinancialDaily[]) => {
        next.forEach(f => {
          f.dailyDate = this.datePipe?.transform(f.dailyDate, "dd/MM")!
        });
        return next.filter(f => f.retailTotal > 0);
      }))
      .subscribe((financialNext: FinancialDaily[]) => {


        console.log(financialNext);

        financialNext.forEach(p => {
          dataValue.push(p.retailTotal);
          dataLabel.push(p.dailyDate)
        });

        this.reportsService.getCloseReport("09/01/2023", "09/30/2023").subscribe((closeNext: any) => {

          console.log(closeNext);

        }, error => {
          this.dialogService.openGenericInfo("Error", error)
        });

        /*  !.series[0].data.push([Date.now(),data]); */

        //let data = this.chartOptions!.series![0].data;

        this.chartOptions!.series = [{
          name: "series",
          data: dataValue
        }];

        this.chartOptions!.xaxis = {
          categories: dataLabel
        };

      }, error => {
        this.dialogService.openGenericInfo("Error", error)
      });
  }
}
