import {Component, Inject} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cell-render-customer-button',
  standalone: true,
  imports: [],
  templateUrl: './cell-render-customer-button.component.html',
  styleUrl: './cell-render-customer-button.component.css'
})
export class CellRenderCustomerButtonComponent implements ICellRendererAngularComp {

  private params!: ICellRendererParams;

  constructor(
    private router: Router
  ) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    console.log('Params cells ', params)
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    9
    return true;
  }

  onViewCustomer() {
    this.router.navigateByUrl("home/layout/customers/customer/1")
  }
}
