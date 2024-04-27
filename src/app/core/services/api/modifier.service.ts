import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {catchError} from "rxjs/operators";
import {Observable} from "rxjs";
import {ModifiersGroup} from "@models/modifier.model";
import {Aggregate} from "@models/aggregate";

@Injectable({
  providedIn: 'root'
})
export class ModifierService {
  path = '/modifiers';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  /*
  getAssociatedMeasures(url: string, idMeasure: string): Observable<Measure[]> {
    return this._http.get<Measure[]>(url + this.path + '/' + idMeasure + '/associatedMeasures')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
 */

  getModifierGroupById(url: string, modifierGroupById: string) {
    return this._http.get<ModifiersGroup>(url + this.path + '/modifiersGroup/' + modifierGroupById)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getModifierGroup(url: string): Observable<ModifiersGroup[]> {
    return this._http.get<ModifiersGroup[]>(url + this.path + '/modifiersGroup')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  posModifierGroup(url: string, description: string, price: number, number: number): Observable<ModifiersGroup[]> {
    return this._http.post<ModifiersGroup[]>(url + this.path + '/modifiersGroup',
      {
        description, price, number
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteModifierGroup(url: string, id: string) {
    return this._http.delete<ModifiersGroup[]>(url + this.path + '/modifiersGroup/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  putModifierGroup(url: string, modifierGroup: ModifiersGroup) {
    return this._http.put<ModifiersGroup[]>(url + this.path + '/modifiersGroup/' + modifierGroup.id,
      {
        description: modifierGroup.description,
        price: 0,
        number: modifierGroup.number,
        isDefault: modifierGroup.isDefault
      })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getModifiers(url: string): Observable<Aggregate[]> {
    return this._http.get<Aggregate[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  posProductToModifierGroup(url: string, idProduct: string, idModifierGroup: string, price: number): Observable<ModifiersGroup> {

    return this._http.post<ModifiersGroup>(url + this.path + '/modifiersGroupsModifier', {
      aggregateProductId: idProduct,
      aggregateGroupId: idModifierGroup,
      price: price
    })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  posMenuToGroupProduct(url: string, productId: string, idModifierGroup: string, price: number): Observable<ModifiersGroup[]> {
    return this._http.post<ModifiersGroup[]>(url + this.path + '/modifiersGroupProduct', {
      price: price,
      productId: productId,
      aggregateGroupId: idModifierGroup
    })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteElementModifierGroup(url: string, modifierId: string, aggregateId: string): Observable<ModifiersGroup> {
    return this._http
      .delete<ModifiersGroup>(url + this.path + '/modifiersGroupsModifier/' + modifierId + '/modifier/' + aggregateId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getModifierGroupByProduct(url: string, idProduct: string) {
    return this._http.get<ModifiersGroup[]>(url + this.path + '/modifiersGroupProduct/' + idProduct)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteModifierGroupByMenu(url: string, idMenu: string, idModifierGroup: string) {
    return this._http
      .delete<ModifiersGroup[]>(url + this.path + '/modifiersGroupProduct/' + idModifierGroup + '/product/' + idMenu)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
