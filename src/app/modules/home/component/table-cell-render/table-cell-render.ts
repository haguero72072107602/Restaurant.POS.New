import {Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from 'ag-grid-community';
import {Invoice} from "@models/invoice.model";

@Component({
  selector: 'app-table-cell-render',
  templateUrl: 'table-cell-render.html',
  styleUrls: ['./table-cell-render.css']
})
export class TableCellRender implements ICellRendererAngularComp {

  params!: ICellRendererParams;
  orderInfo: string = "";


  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.orderInfo = this.params!.data!.orderInfo;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    // As we have updated the params we return true to let AG Grid know we have handled the refresh.
    // So AG Grid will not recreate the cell renderer from scratch.
    return true;
  }

}
