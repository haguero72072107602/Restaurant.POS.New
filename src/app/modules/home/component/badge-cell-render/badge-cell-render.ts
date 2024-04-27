import {Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams, ValueFormatterParams} from "ag-grid-community";

@Component({
  selector: 'app-badge-cell-render',
  templateUrl: './badge-cell-render.html',
  styleUrls: ['./badge-cell-render.css']
})
export class BadgeCellRender implements ICellRendererAngularComp {

  params!: ICellRendererParams;
  public statusText?: string;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.statusText! = this.onGetText(params);
  }

  refresh(params: ICellRendererParams<any>): boolean {
    this.params = params;
    this.statusText! = this.onGetText(params);
    return true;
  }

  onGetText(param: ICellRendererParams) {
    switch (Number(param!.data!.status)) {
      case 1:
        return 'Progress';
      case 3:
        return 'Hold';
      case 4:
        return param!.data!.isRefund ? 'Refund' : 'Paid';
      case 5:
        return 'Cancel';
      case 6:
        return 'Create';
      case 7:
        return 'Pendent for payment';
      case 8:
        return 'Remove on hold';
      default:
        return '';
    }
  }
}
