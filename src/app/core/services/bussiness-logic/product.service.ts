import {Injectable} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {Product} from "@models/product.model";
import {InventoryOperationType} from "@core/utils/operations/inventory-operation-type.enum";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private dataStorage: DataStorageService) {
  }

  delProduct(productId: string) {
    return this.dataStorage.delProduct(productId);
  }

  postProduct(product: Product) {
    return this.dataStorage.postProduct(product);
  }


  putProduct(product: Product) {
    return this.dataStorage.putProduct(product);
  }

  adjustProduct(id: string, formOperation: InventoryOperationType, formUnitCost: number, formUnitInStock: number, formNote: string) {
    return this.dataStorage.adjustProduct(id, formOperation, formUnitCost, formUnitInStock, formNote);
  }

}
