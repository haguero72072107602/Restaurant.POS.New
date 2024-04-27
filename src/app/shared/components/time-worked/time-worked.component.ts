import {Component, Input, OnInit} from '@angular/core';
import {GridOptions, GridApi} from 'ag-grid-community';
import {dateFormatter} from "@core/utils/functions/transformers";
import {WorkerRecords} from "@models/worker-records";
import {EClockType} from "@core/utils/clock-type.enum";


@Component({
  selector: 'time-worked',
  templateUrl: './time-worked.component.html',
  styleUrls: ['./time-worked.component.scss']
})
export class TimeWorkedComponent implements OnInit {
  // Worker
  @Input() emplSel: any;
  public gridOptions?: GridOptions;
  columnDefs: any;
  bottomData = [{
    clockType: 'Time worked',
    clockTime: ''
  }]
  private gridApi?: GridApi;

  constructor() {
    this.updateGridOptions();
  }

  // Worker records
  private _records?: Array<WorkerRecords>;

  get records() {
    return this._records;
  }

  @Input()
  set records(data) {
    this._records = data;
    if (this._records) this.setData();
  }

  //Time worked
  private _time?: string;

  get time() {
    return this._time;
  }

  @Input()
  set time(data) {
    this._time = data;
    if (this._time) this.setTotal();
  }

  ngOnInit() {
    this.gridApi = this.gridOptions!.api!;
  }

  updateGridOptions() {
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        //this.gridOptions!.api!.sizeColumnsToFit();
      },
      onBodyScroll: (ev) => {
        //this.gridOptions!.api!.sizeColumnsToFit();
      },
      rowHeight: 50,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Record Type',
        field: 'clockType',
        width: 100
      },
      {
        headerName: 'Datetime',
        field: 'clockTime',
        width: 120
      }
    ];
  }

  private setData() {
    console.log('setData', this.records);
    let records = this.records!.map(data => {
      return {'clockType': 'Clock ' + EClockType[data.clockType], 'clockTime': dateFormatter(data.clockTime)}
    });
    //this.gridOptions!.api!.setRowData(records);
    //this.gridOptions!.api!.sizeColumnsToFit();
  }

  private setTotal() {
    console.log('setData', this.time);
    this.bottomData[0].clockTime = this.time!.split('.')[0];
  }

  /*onPrint() {
    console.log('Print invoices by user', this.emplSel);
    if(this.emplSel){
      this.dataStorage.printInvoiceByUser(this.emplSel.id).subscribe(next => {
        console.log(next);
      }, error1 => {
        console.error('getSales', error1);
      });
    } else {
      console.log('Debe seleccionar un empleado');
    }
  }*/
}
