import {Component, Input, OnInit} from '@angular/core';
import {GridOptions, GridApi} from 'ag-grid-community';
import {Theme} from 'src/app/models/theme';
import {DataStorageService} from "@core/services/api/data-storage.service";

@Component({
  selector: 'sales-shop',
  templateUrl: './sales-shop.component.html',
  styleUrls: ['./sales-shop.component.scss']
})
export class SalesShopComponent implements OnInit {
  theme: string = this.th.theme;
  public gridOptions?: GridOptions;
  columnDefs: any;
  private gridReady?: boolean;
  private gridApi?: any;

  constructor(private dataStorage: DataStorageService, private th: Theme) {
    this.updateGridOptions();
  }

  private _sales?: Array<any>;

  get sales() {
    return this._sales;
  }

  @Input()
  set sales(data) {
    this._sales = data;
    if (this._sales && this.gridReady) this.setData();
  }

  ngOnInit() {
    this.gridApi = this.gridOptions!.api;
  }

  updateGridOptions() {
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        this.setData();
        //this.gridOptions!.api!.sizeColumnsToFit();
      },
      onBodyScroll: (ev) => {
        //this.gridOptions!.api!.sizeColumnsToFit();
      },
      rowHeight: 60,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  onPrint() {
    console.log('Print payments type');
    this.dataStorage.printPaymentByType().subscribe(next => {
      console.log(next);
    }, error1 => {
      console.error('getSales', error1);
    });
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Payment type',
        field: 'name',
        width: 250
      },
      {
        headerName: 'Total',
        field: 'total',
        type: 'numericColumn'
      }
    ];
  }

  private setData() {
    this.sales!.forEach((v, i) => this.sales![i].total = (v.total).toFixed(2));
    //this.gridOptions!.api!.setRowData(this.sales!);
    //this.gridOptions!.api!.sizeColumnsToFit();
  }

}
