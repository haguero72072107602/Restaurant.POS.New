import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Observable} from 'rxjs';
import {ProductOrder} from 'src/app/models/product-order.model';
import {catchError} from 'rxjs/operators';
import {ProcessHTTPMSgService} from './ProcessHTTPMSg.service';
import {ETransferType} from '../../utils/transfer-type.enum';
import {EApplyDiscount} from '../../utils/apply-discount.enum';
import {ETXType} from '../../utils/delivery.enum';
import {Invoice} from '@models/invoice.model';
import {EOperationType} from "@core/utils/operation.type.enum";
import {IProductRestaurantDetails} from "@models/product-restaurant-details.model";
import {Order} from "@models/order.model";
import {PaymentInvoice} from "@models/financials/payment-invoice.model";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  path = '/invoices';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  create(url: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/status/created');
  }

  createInvoiceWithOrder(url: string, orderType: ETXType, tableId: string): Observable<Invoice> {
    let params = new HttpParams();
    if (orderType) {
      params = params.append('orderType', orderType + '');
    }
    if (tableId) {
      params = params.append('tableId', tableId);
    }
    return this._http.get<Invoice>(url + this.path + '/status/created/order', {params});
  }

  changeInvoiceToHold(url: string, invoice: Invoice, userName?: string): Observable<Invoice> | any {
    if (invoice.id) {
      console.log('Hold:', invoice);
      let params = new HttpParams();
      if (userName) {
        params = params.append('username', userName);
      }
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber +
        '/status/hold', invoice, {params: params})
        .pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  changeInvoiceToInProgress(url: string, invoice: Invoice, userName?: string): Observable<Invoice> | any {
    if (invoice.id) {
      console.log('Hold:', invoice);
      let params = new HttpParams();
      if (userName) {
        params = params.append('username', userName);
      }
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber +
        '/status/inProgress', invoice, {params: params},)
        .pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  changeInvoiceToVoid(url: string, invoice: Invoice, userName?: string): Observable<Invoice> | any {
    if (invoice.id) {
      console.log('Void:', invoice);
      let params = new HttpParams();
      if (userName) params = params.append('username', userName);
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/void',
        invoice, {params: params}).pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  changeInvoiceToRemoveHold(url: string, invoice: Invoice): Observable<Invoice> | any {
    if (invoice.id) {
      console.log('RemoveHold:', invoice);
      return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/status/removeHold', invoice)
        .pipe(catchError(this.processHttpMsgService.handleError));
    }
  }

  getInvoiceByStatus = (url: string, status: InvoiceStatus) => {
    let params = new HttpParams();
    params = params
      .append('pageNumber', '0')
      .append('pageSize', '0');
    return this._http.get<Invoice[]>(url + this.path + '/status/' + status, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getStatusInvoices(url: string) {
    return this._http.get<any[]>(url + this.path + '/status/')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getById(url: string, id: string, operationType: EOperationType): Observable<Invoice> {
    let params = new HttpParams();
    params = params
      .append('operationType', operationType + '');
    return this._http.get<Invoice>(url + this.path + '/receiptNumber/' + id, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addProductOrder(url: string, product: ProductOrder, invoiceId: string, operation: EOperationType,
                  isRefund: boolean, username?: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('operationType', operation + '');
    params = params.append('isRefund', isRefund + '');
    params = params.append('isScalable', product.scalable + '');
    params = params.append('username', username + '');
    /*
    const productDto = {
      productId: product.productId,
      quantity: product.quantity,
      unitCost: product.unitCost,
      total: product.total};
     */
    return this._http.post(url + this.path + '/' + invoiceId + '/product', product, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProductOrder(url: string, productOrderId: string, invoiceId: string): Observable<any> {
    return this._http.delete(url + this.path + '/' + invoiceId + '/product/' + productOrderId)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  deleteProductOrders(url: string, productOrders: ProductOrder[], invoiceId: string,
                      userName?: string): Observable<any> {
    let params = new HttpParams();
    if (userName) params = params.append('username', userName);
    return this._http.request('delete', url + this.path + '/' + invoiceId + '/product',
      {body: productOrders, params: params}).pipe(catchError(this.processHttpMsgService.handleError));
  }

  getByDateRange(url: string, fromDate: Date | string, toDate: Date | string, pageNumber: number, pageSize: number): Observable<Invoice[]> {
    let params = new HttpParams();
    params = params.append('fromDate', fromDate + '');
    params = params.append('toDate', toDate + '');
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '');

    return this._http.get<Invoice[]>(url + this.path + '/daterange', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getAllWithoutPage = (url: string) => {
    // let params = new HttpParams();
    // params = params.append('pageNumber', page.page.toString()).append('pageSize', page.size.toString());
    return this._http.get<Invoice[]>(url + this.path)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printInvoice(url: string, invoice: Invoice): Observable<Invoice[]> {
    return this._http.post<Invoice[]>(url + this.path + '/' + invoice.receiptNumber + '/print', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  printLastInvoice(url: string): Observable<Invoice[]> {
    return this._http.post<Invoice[]>(url + this.path + '/print/last', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  prepareInvoice(url: string, invoice: Invoice, userName?: string, note?: string): Observable<Invoice[]> {
    let params = new HttpParams();
    if (userName) {
      params = params.append('username', userName);
    }
    if (note) {
      params = params.append('description', note);
    }
    return this._http.post<Invoice[]>(url + this.path + '/' + invoice.receiptNumber + '/print/kitchen',
      {}, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  prepareInvoiceAll(url: string, invoice: Invoice, userName?: string, note?: string): Observable<Invoice[]> {
    let params = new HttpParams();
    if (userName) {
      params = params.append('username', userName);
    }
    if (note) {
      params = params.append('description', note);
    }
    return this._http.post<Invoice[]>(url + this.path + '/' + invoice.receiptNumber + '/print/kitchen/all',
      {}, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  subtotalInvoice(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/subtotal/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  fsSubtotalInvoice(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/fsSubtotal/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInvoiceByIdRefund(url: string, id: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/status/refund', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateInvoice(url: string, invoice: Invoice, property: string, value: any) {
    const documentPacth = [{op: 'replace', path: '/' + property, value: value}];
    // return this._http.patch<Invoice>(url + this.path + '/' + invoice.receiptNumber, documentPacth);
    return this._http.post<Invoice>(url + this.path + '/' + invoice.receiptNumber + '/' + property + '/' + value, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  applyDiscountInvoice(url: string, id: string, discount: number, productOrderIds: Array<string>,
                       discountType: EApplyDiscount): Observable<Invoice> {
    let params = new HttpParams();
    params = params.append('discountType', discountType + '');
    return this._http.post<Invoice>(url + this.path + '/' + id + '/discount/' + discount,
      productOrderIds, {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  recallCheck(url: string, id: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/recallcheck/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  reviewCheck(url: string, id: string): Observable<Invoice> {
    return this._http.get<Invoice>(url + this.path + '/reviewcheck/' + id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  cancelCheck(url: string, id: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/status/cancel', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getInvoiceByTransferType(url: string, auth: ETransferType) {
    return this._http.get<Invoice[]>(url + this.path + '/transfertype/' + auth)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  setUser(url: string, id: string, idUser: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/' + id + '/user/' + idUser, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  weightItem(url: string, receiptNumber: string, price: number, weight?: number): Observable<Invoice> {
    let params = new HttpParams();
    params = params.append('price', price + '');
    params = params.append('weight', weight + '');
    return this._http.post<Invoice>(url + '/products/weightItem/invoice/' + receiptNumber, '', {params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  clearInvoice(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/clear/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  refundSale(url: string, receiptNumber: string) {
    return this._http.post<Invoice>(url + this.path + '/' + receiptNumber + '/refundSale', {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getSelectedOptionsProduct(url: string, id: string, receiptNumber: string): Observable<IProductRestaurantDetails> {
    return this._http.get<IProductRestaurantDetails>(url + this.path + '/' + receiptNumber + '/productOrder/' + id + '/details')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  updateProductOrderByInvoice(url: string, po: ProductOrder[], receiptNumber: string): Observable<Invoice> {
    return this._http.put<Invoice>(url + this.path + '/' + receiptNumber + '/productOrders',
      po
    ).pipe(catchError(this.processHttpMsgService.handleError));
  }

  editProductOrderByInvoice(url: string, po: ProductOrder, receiptNumber: string) {
    return this._http.put<Invoice>(url + this.path + '/' + receiptNumber + '/productOrder/' + po.id,
      po
    ).pipe(catchError(this.processHttpMsgService.handleError));
  }

  removeTip(url: string, receiptNumber: string): Observable<Invoice> {
    return this._http.post<Invoice>(url + this.path + '/clear/tip/' + receiptNumber, {})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  addNoteInvoice(url: string, receiptNumber: string, noteInvoice: string) {
    return this._http.put<Invoice>(url + this.path + '/' + receiptNumber + '/note', {
      note: noteInvoice,
    }).pipe(catchError(this.processHttpMsgService.handleError));
  }

  addPrepareNoteInvoice(url: string, receiptNumber: string, prepareNoteInvoice: string) {
    return this._http.put<Invoice>(url + this.path + '/' + receiptNumber + '/prepareNote', {
      note: prepareNoteInvoice,
    }).pipe(catchError(this.processHttpMsgService.handleError));
  }


  deleteInvoice(url: string, receiptNumber: string) {
    return this._http.delete<Invoice>(url + this.path + '/' + receiptNumber)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }


  getInvoicePayment(url: string, invoiceId: string) {
    return this._http.get<Order>(url + this.path + '/' + invoiceId + '/payments')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  tipAuthorization(url: string, paymentMethod: any, paymentInvoice: PaymentInvoice) {
    let params = new HttpParams();
    params = params.append('paymentMethod', paymentMethod + '');

    return this._http.post<any>(url + this.path + '/payment/tipAuthorization', paymentInvoice, {params: params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  pendingInvoice(url: string, statusInvoice: InvoiceStatus[]) {
    let params = new HttpParams();
    statusInvoice
      .forEach(p => {
        params = params.append('states', p);
      })
    params = params.append('pageNumber', 0 + '');
    params = params.append('pageSize', 0 + '');

    return this._http.get<any>(url + this.path + '/states', {params: params})
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  aggregateCustomerInvoice(url: string, invoiceId: string, customerId: string): Observable<Invoice> {
    return this._http.put<Invoice>(url + this.path + '/' + invoiceId + "/client/" + customerId, {
      id: invoiceId,
      clientId: customerId
    })
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
