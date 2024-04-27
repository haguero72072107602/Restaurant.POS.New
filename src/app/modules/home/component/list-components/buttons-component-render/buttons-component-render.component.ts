import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ICellRendererAngularComp} from "ag-grid-angular";
import {ICellRendererParams} from "ag-grid-community";
import {Router} from "@angular/router";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {Inventory} from "@models/inventory";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";

@Component({
  selector: 'app-buttons-component-render',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buttons-component-render.component.html',
  styleUrl: './buttons-component-render.component.css'
})
export class ButtonsComponentRender implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  status: number = 0;
  inventory?: Inventory;

  constructor(
    private router: Router,
    private inventoryService: InventoryService,
    private dialogService: DialogService) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;

    this.inventory = this.params!.data! as Inventory;

    console.log('Table cell', params);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }

  editInventory() {
    this.router
      .navigateByUrl('/home/layout/inventory/componentEdit/' + this.inventory?.id);
  }

  deleteComponent() {
    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION,
      "Question", "You want to remove this product", undefined, DialogConfirm.BTN_CONFIRM)!
      .afterClosed().subscribe(next => {
      if (next) {

        this.inventoryService.deleteInventory(this.inventory?.id!).subscribe((next: Inventory[]) => {
          console.log(next);
          this.params.api.setRowData(next);
        })


      }
    })

  }

}
