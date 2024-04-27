import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {Inventory} from "@models/inventory";
import {ProductComponent} from "@models/product-component.model";
import {InventoryOperationType} from "@core/utils/operations/inventory-operation-type.enum";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  path = '/Components';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getInventory(url: string): Observable<Inventory[]> {
    return this._http.get<Inventory[]>(url + this.path + '/')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInventoryId(url: string, id: string): Observable<Inventory> {
    return this._http.get<Inventory>(url + this.path + '/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  postInventory(url: string, inventory: Inventory): Observable<Inventory[]> {
    return this._http.post<Inventory[]>(url + this.path + '/', inventory)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  putInventory(url: string, inventory: Inventory): Observable<Inventory[]> {
    return this._http.put<Inventory[]>(url + this.path + '/' + inventory.id, inventory)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteInventory(url: string, id: string): Observable<Inventory[]> {
    return this._http.delete<Inventory[]>(url + this.path + '/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addProcuctComponents(url: string, productComponent: ProductComponent): Observable<any> {
    return this._http.post<any>(url + this.path + '/product', productComponent)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getProductComponents(url: string, productId: string) {
    return this._http.get<ProductComponent[]>(url + this.path + '/product/' + productId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  delProductComponents(url: string, productId: string, componentId: string) {
    return this._http.delete<ProductComponent[]>(url + this.path + '/' + componentId + '/product/' + productId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  adjustComponent(url: string, id: string, formOperation: InventoryOperationType,
                  formUnitCost: number, formUnitInStock: number, formNote: string) {
    return this._http.put<any>(url + this.path + '/operation', {
      id: id,
      unitInStock: formUnitInStock,
      unitCost: formUnitCost,
      inventoryOperationType: formOperation,
      note: formNote
    })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


}

