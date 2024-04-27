import {Component} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {Product} from "@models/product.model";

@Component({
  selector: 'app-inv-picture-render',
  templateUrl: './inv-picture-render.component.html',
  styleUrls: ['./inv-picture-render.component.css']
})
export class InvPictureRender {
  params!: ICellRendererParams;
  status: number = 0;
  product?: Product;

  constructor(private reportService: ReportsService,
              private authService: AuthService,
              private cashService: CashService) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.status = this.params!.data!.status;
    this.product = this.params!.data! as Product;
    console.log('Table cell', params);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }

}
