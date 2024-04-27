import {Injectable} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {ComponentSubmayor} from "@models/component-submayor.model";
import {ProductSubmajor} from "@models/product.submajor";

@Injectable({
  providedIn: 'root'
})
export class InventorySubmajorService {
  constructor(
    private dataStorage: DataStorageService,
    private sanitizer: DomSanitizer) {
  }

  getProductSubmajor(productId: string, startDate: string, endDate: String): Observable<ComponentSubmayor[]> {
    return this.dataStorage.getProductSubmajor(productId, startDate, endDate);
  }

  getMenuSubmajor(productId: string, startDate: string, endDate: String): Observable<ProductSubmajor[]> {

    return this.dataStorage.getMenuSubmajor(productId, startDate, endDate);
  }

}
