import {Component} from '@angular/core';
import {AgChartOptions} from 'ag-charts-community';

@Component({
  selector: 'app-ag-chart',
  templateUrl: './ag-chart.component.html',
  styleUrl: './ag-chart.component.css'
})
export class AgChartComponent {
  public options: AgChartOptions;

  constructor() {
    this.options = {
      data: [
        {value: 56.9},
        {value: 22.5},
        {value: 6.8},
        {value: 8.5},
        {value: 2.6},
        {value: 1.9},
      ],
      series: [
        {
          type: 'pie',
          angleKey: 'value',
        },
      ],
    };
  }
}
