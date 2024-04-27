import {Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {Router} from "@angular/router";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {Product} from "@models/product.model";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {ProductService} from "@core/services/bussiness-logic/product.service";


@Component({
  selector: 'app-buttons-menu-render',
  templateUrl: './buttons-menu-render.component.html',
  styleUrls: ['./buttons-menu-render.component.css']
})
export class ButtonsMenuRender implements ICellRendererAngularComp {

  params!: ICellRendererParams;
  status: number = 0;
  product?: Product;

  constructor(
    private router: Router,
    private productService: ProductService,
    private dialogService: DialogService) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.product = this.params!.data! as Product;

    console.log('Table cell', params);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }

  editProduct() {
    this.router.navigateByUrl("/home/layout/inventory/productEdit/" + this.product?.id)
    /*
    this.dialogService.dialogEditComponent(this.inventory!)
        .afterClosed()
        .subscribe((next: InventoryModel[]) => {
          if (next) {
            console.log(next);
            this.params.api.setRowData(next);

            this.params.api.clearFocusedCell()

          }
        });
     */
  }

  deleteComponent() {
    //You want to remove this product

    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION,
      "Question", "You want to remove this product", undefined, DialogConfirm.BTN_CONFIRM)
      .afterClosed().subscribe(next => {
      if (next) {
        console.log("Eliminae elemento");

        this.productService.delProduct(this.product?.id!)
          .subscribe((next: any) => {

            let allRows: Product[] = [];
            this.params.api.forEachNodeAfterFilter((rowNode) => allRows.push(rowNode.data));

            allRows.splice(allRows.indexOf(this.product!), 1);

            this.params.api?.setRowData(allRows);

          }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error))

      }
    })


  }
}
