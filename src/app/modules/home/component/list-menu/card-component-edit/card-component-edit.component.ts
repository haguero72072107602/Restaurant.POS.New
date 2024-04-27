import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogType} from "@core/utils/dialog-type.enum";
import {DomSanitizer} from "@angular/platform-browser";
import {Inventory} from "@models/inventory";
import {CategoryService} from "@core/services/bussiness-logic/category.service";
import {InventoryOperationType} from "@core/utils/operations/inventory-operation-type.enum";
import {Product} from "@models/product.model";
import {ProductService} from "@core/services/bussiness-logic/product.service";

@Component({
  selector: 'app-card-component-edit',
  templateUrl: './card-component-edit.component.html',
  styleUrl: './card-component-edit.component.css'
})
export class CardComponentEditComponent {

  inventoryid!: string;
  titleOperation?: string;
  instanceData: any;

  formNote?: string
  formUnitCost: number = 0;
  formUnitInStock: number = 0;
  formOperation: InventoryOperationType = InventoryOperationType.Purchase;

  constructor(private dialog: MatDialogRef<CardComponentEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private inventoryService: InventoryService,
              private productService: ProductService,
              private categoryService: CategoryService,
              private sanitizer: DomSanitizer,
              private dialogService: DialogService) {

    this.titleOperation = ("tax" in data) ? "Update product" : "Update inventory";

    this.instanceData = data;
    this.inventoryid = data.id;
  }

  get priceDisabled() {
    return this.formOperation == InventoryOperationType.PositiveAdjust ||
      this.formOperation == InventoryOperationType.NegativeAdjust
  }

  get quantityDisabled() {
    return this.formOperation == InventoryOperationType.UpdateUnitCost
  }


  onClose() {
    this.dialog.close();
  }

  onSubmit() {
    if (this.formNote?.trim() === "") {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, "Please write a note..");
      return;
    }

    const writerData = ("tax" in this.instanceData) ?
      this.productService.adjustProduct(this.inventoryid,
        this.formOperation, this.formUnitCost, this.formUnitInStock, this.formNote!) :
      this.inventoryService.adjustComponent(this.inventoryid,
        this.formOperation, this.formUnitCost, this.formUnitInStock, this.formNote!);

    writerData.subscribe((next: any) => {
      console.log(next)
      this.dialog.close(next);
    }, (error: any) => this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error))
  }

  changeOperation($event: Event) {
    console.log($event, " ->", this.formOperation)
  }
}
