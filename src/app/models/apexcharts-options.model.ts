import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexTitleSubtitle,
  ApexXAxis
} from "ng-apexcharts"

export type ChartOptions = {
  series: ApexAxisChartSeries,
  chart: ApexChart,
  xaxis: ApexXAxis,
  title: ApexTitleSubtitle,
  fill: ApexFill,
  plotOptions: ApexPlotOptions,
  labels: any,

}
