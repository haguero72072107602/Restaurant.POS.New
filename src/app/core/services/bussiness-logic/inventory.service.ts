import {Injectable, SecurityContext} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";
import {Inventory} from "@models/inventory";
import {ProductComponent} from "@models/product-component.model";
import {InventoryOperationType} from "@core/utils/operations/inventory-operation-type.enum";


@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(
    private dataStorage: DataStorageService,
    private sanitizer: DomSanitizer) {
  }

  getInventory(): Observable<Inventory[]> {
    return this.dataStorage.getInventory()
      .pipe(map((inventory: Inventory[]) => {
        inventory.forEach((item, index) => {
          item.imageBase64 = item.image != undefined ?
            this.sanitizer.sanitize(SecurityContext.NONE,
              this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + item.image))
            : undefined
        });
        return inventory;
      }));
  }

  getInventoryId(id: string): Observable<Inventory> {
    return this.dataStorage.getInventoryId(id);
  }

  postInventory(inventory: Inventory): Observable<Inventory[]> {
    return this.dataStorage.postInventory(inventory);
  }

  putInventory(inventory: Inventory): Observable<Inventory[]> {
    return this.dataStorage.putInventory(inventory);
  }

  deleteInventory(id: string): Observable<Inventory[]> {
    return this.dataStorage.deleteInventory(id);
  }

  addProductComponents(productComponent: ProductComponent): Observable<any> {
    return this.dataStorage.addProductComponents(productComponent);
  }

  getProductComponents(productId: string): Observable<ProductComponent[]> {
    return this.dataStorage.getProductComponents(productId);
  }

  delProductComponents(productId: string, componentId: string): Observable<ProductComponent[]> {
    return this.dataStorage.delProductComponents(productId, componentId);
  }

  /*
  adjustComponent(productId: string, componentId: string): Observable<ProductComponent[]> {
    return this.dataStorage.adjustComponent(productId, componentId);
  }
   */

  adjustComponent(id: string, formOperation: InventoryOperationType, formUnitCost: number, formUnitInStock: number, formNote: string) {
    return this.dataStorage.adjustComponent(id, formOperation, formUnitCost, formUnitInStock, formNote);
  }


}





