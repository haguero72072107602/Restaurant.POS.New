import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DataStorageService} from '../api/data-storage.service';
import {DialogService} from './dialog.service';
import {InvoiceService} from './invoice.service';
import {ETXType} from '../../utils/delivery.enum';
import {EOperationType} from '../../utils/operation.type.enum';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {Router} from '@angular/router';
import {OperationsService} from './operations.service';
import {Table} from "@models/table.model";
import {FinancialOpEnum} from "@core/utils/operations";
import {LocalLayout} from "@models/local.layout.model";


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  table?: Table;
  operationType?: ETXType;

  constructor(public utilsServ: DialogService, public invoiceServ: InvoiceService,
              private operationServ: OperationsService, private dataStorage: DataStorageService,
              private router: Router) {
  }

  tables(): Observable<Table[]> {
    return this.dataStorage.getTables();
  }

  setOrder(type: ETXType, table?: string, callback?: any) {
    this.operationType = type;
    this.invoiceServ.createInvoice(type, table, callback);
  }

  recallCheck() {
    this.operationServ.currentOperation = FinancialOpEnum.RECALL;
    this.invoiceServ.getInvoiceByStatus(EOperationType.RecallCheck, InvoiceStatus.IN_HOLD)
      .subscribe(next => this.utilsServ.openDialogInvoices(next, i => {
          // this.invoiceServ.setInvoice(i);
          this.operationServ.getCheckById(EOperationType.RecallCheck, j => {
            this.invoiceServ.setInvoice(j);
            this.invoiceServ.isRecalled = true;
            //this.router.navigateByUrl('cash/order');
          }, i.receiptNumber);
        }),
        err => this.utilsServ.openGenericInfo('Error', err));
  }

  manager() {
    this.operationServ.manager()
  }

  sendAck(): Observable<any> {
    // throw of(new Error('Method not implemented.'));
    return this.dataStorage.sendAck('table-layout');
  }

}
