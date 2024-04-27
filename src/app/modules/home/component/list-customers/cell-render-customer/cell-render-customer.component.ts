import {Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from 'ag-grid-community';

@Component({
  selector: 'app-cell-render-customer',
  standalone: true,
  imports: [],
  templateUrl: './cell-render-customer.component.html',
  styleUrl: './cell-render-customer.component.css'
})
export class CellRenderCustomerComponent implements ICellRendererAngularComp {

  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }

}
