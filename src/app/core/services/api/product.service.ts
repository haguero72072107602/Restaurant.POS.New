import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EOperationType} from '../../utils/operation.type.enum';
import {catchError} from 'rxjs/operators';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {Product, ProductUpdate} from "@models/product.model";
import {IProductRestaurantDetails} from "@models/product-restaurant-details.model";
import {InventoryOperationType} from "@core/utils/operations/inventory-operation-type.enum";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getProductByUpc(url: string, upc: string, typeOp: EOperationType, pageNumber: number = 1, pageSize: number = 60): Observable<Product[]> {
    let params = new HttpParams();
    params = params.append('value', upc);
    params = params.append('operationType', typeOp + '');
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '');
    return this._http.get<any>(url + '/products/attribute', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProductByUpc(url: string, upc: string, id: string, price: string): Observable<Product[]> {
    const payload = new ProductUpdate(id, upc, +price);
    return this._http.post<any>(url + '/products/attribute/', payload)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProductByAttr(url: string, upc: string, id: string, value: string, attr: 'price' | 'color'): Observable<Product[]> {
    const payload = new ProductUpdate(id, upc, undefined, value);
    return this._http.post<any>(url + '/products/attribute/' + attr, payload)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getOptionsProduct(url: string, id: string): Observable<IProductRestaurantDetails> {
    return this._http.get<any>(url + '/products/' + id + '/details')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getProduct(url: string, id: string): Observable<Product> {
    return this._http.get<any>(url + '/products/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getProductList(url: string): Observable<Product[]> {
    return this._http.get<Product[]>(url + '/products/')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  delProduct(url: string, productId: string) {
    return this._http.delete<any>(url + '/products/' + productId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  postProduct(url: string, product: Product) {
    return this._http.post<Product>(url + '/products',
      {
        name: product.name,
        upc: product.upc,
        format: 1,
        unitInStock: 0,
        unitCost: product.unitCost,
        applyTax: product.applyTax,
        priorityOrder: 0,
        generic: product.generic,
        followDepartment: true,
        tax: product.tax,
        ageVerification: true,
        ageAllow: 0,
        foodStamp: true,
        departmentId: product.departmentId,
        description: product.description,
        taz: product.tax,
        measureId: product.measureId,
        currentPrice: product.currentPrice
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  putProduct(url: string, product: Product) {
    return this._http.put<Product>(url + '/products/' + product.id, product)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  adjustProduct(url: string, id: string, formOperation: InventoryOperationType, formUnitCost: number, formUnitInStock: number, formNote: string) {
    return this._http.put<any>(url + '/products/operation', {
      id: id,
      unitInStock: formUnitInStock,
      unitCost: formUnitCost,
      inventoryOperationType: formOperation,
      note: formNote
    })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
