import {Component, Inject, Input, OnInit} from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {
  CellClassParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent, ModuleRegistry, ValueFormatterParams
} from "ag-grid-community";

import {IInventorySubmajor} from "@models/inventory-submajor";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";


@Component({
  selector: 'app-submayor-product',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  template: `
    <div class="w-full h-full">
      <ag-grid-angular
        style="width: 100%; height: 100%; padding: 4px"
        class="ag-theme-material"
        [suppressCellFocus]="true"
        [defaultColDef]="varGlobalService.defaultColDef"
        [columnDefs]="columnDefs"
        [rowData]="InventorySubmajor"
        (gridReady)="onGridReady($event)"
        (firstDataRendered)="onFirstDataRendered($event)"
      ></ag-grid-angular>
    </div>
  `,
  styleUrl: './submayor-product.component.css'
})
export class SubmayorProductComponent implements OnInit {
  varGlobalService = Inject(VariableGlobalService);

  @Input({required: true}) InventorySubmajor: IInventorySubmajor[] = [];

  loadingCustomer: boolean = true;
  columnDefs: undefined | ColDef[] = [];
  gridApi!: GridApi;

  ngOnInit(): void {
    this.onColumnDefs()
  }

  cellStyle(params: CellClassParams<any, any>) {
    return {
      /*color: (params.data.unitInStock < 0) ? '#EA5252' : 'black',*/
      display: "flex",
      alignItems: "center",
      justifyContent: "left"
    };
  }

  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  AmountFormat(params: ValueFormatterParams) {
    return Number(params.value).toFixed(2);
  }

  private onColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'ID', field: 'productId', sortable: true,
        cellStyle: this.cellStyle,
      },
      {
        headerName: 'NAME', field: 'productName', sortable: false,
        cellStyle: this.cellStyle, type: 'leftAligned'
      },
      {
        headerName: 'INITIAL', field: 'initialQuantity', filter: true,
        valueFormatter: this.AmountFormat, type: 'rightAligned'
      },
      {
        headerName: 'SALE', field: 'operationSalesQuantity', filter: true,
        valueFormatter: this.AmountFormat, type: 'rightAligned'
      },
      {
        headerName: 'OTHERS', field: 'operationOtherUserQuantity', filter: true,
        valueFormatter: this.AmountFormat, type: 'rightAligned'
      },
      {
        headerName: 'ADJUST', field: 'operationAdjustQuantity', filter: true,
        valueFormatter: this.AmountFormat, type: 'rightAligned'
      },
      {
        headerName: 'REFUND', field: 'operationRefundQuantity', filter: true,
        valueFormatter: this.AmountFormat, type: 'rightAligned'
      },
      {
        headerName: 'FINAL', field: 'finalQuantity', filter: true,
        valueFormatter: this.AmountFormat, type: 'rightAligned'
      },
    ];
  }

  private onFilterTextBoxChanged(search: string) {
    console.log("Find menu", search);
    //this.gridApi.setQuickFilter(search)
    this.gridApi?.setGridOption('quickFilterText', search);
  }

}
