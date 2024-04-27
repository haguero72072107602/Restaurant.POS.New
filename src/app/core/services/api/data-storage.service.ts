import {Injectable} from '@angular/core';
import {DepartmentService} from './department.service';
import {Observable} from 'rxjs';
import {ProductService} from './product.service';
import {InvoiceService} from './invoice.service';
import {baseURL} from '../../utils/url.path.enum';
import {PaymentService} from './payment.service';
import {ProductOrder} from 'src/app/models/product-order.model';
import {ICashPayment} from 'src/app/models/cash-payment.model';
import {Journey} from 'src/app/models/journey.model';
import {JourneyService} from './journey.service';
import {
  Aggregate,
  CardManualPayment,
  Credentials,
  CreditCard,
  IProductRestaurantDetails,
  Payment,
  Product,
  Station,
  User
} from 'src/app/models';
import {ConfigurationService} from './configuration.service';
import {Configuration} from 'src/app/models/configuration.model';
import {AdminOperationService} from './admin.operation.service';
import {PaidOut} from 'src/app/models/paid-out.model';
import {Report} from 'src/app/models/report.model';
import {OrderService} from './order.service';
import {ETransferType} from '../../utils/transfer-type.enum';
import {EApplyDiscount} from '../../utils/apply-discount.enum';
import {ClientService} from './client.service';
import {PaymentMethodEnum} from '../../utils/operations/payment-method.enum';
import {EClockType} from '../../utils/clock-type.enum';
import {StationService} from './station.service';
import {ETXType} from '../../utils/delivery.enum';
import {Department} from "@models/department.model";
import {EOperationType} from "@core/utils/operation.type.enum";
import {Invoice} from "@models/invoice.model";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {CheckPayment} from "@models/check.model";
import {GiftCardModel, IGiftCardPaymentModel, IGiftModel} from "@models/gift-card.model";
import {ITransferPayment, TransferPayment} from "@models/transfer.model";
import {EmployeedModel, IPositionModel} from "@models/employeed.model";
import {IInvoicesByStates} from "@models/invoices-by-user.model";
import {CloseBatch} from "@core/utils/close.batch.enum";
import {Order} from "@models/order.model";
import {Table} from "@models/table.model";
import {UserClock} from "@models/user-clock.model";
import {WorkerRecords} from "@models/worker-records";
import {LocalLayoutService} from "@core/services/api/local.layout.service";
import {LocalLayout} from "@models/local.layout.model";
import {TablesService} from "@core/services/api/tables.service";
import {IOnlinePayment} from "@models/online.model";
import {PaymentInvoice} from "@models/financials/payment-invoice.model";
import {InventoryService} from "@core/services/api/inventory.service";

import {Inventory} from "@models/inventory";
import {MeasureService} from "@core/services/api/measure.service";
import {Measure} from '@models/measure.model';
import {CategoryService} from "@core/services/api/category.service";
import {Category} from "@models/category.model";
import {ProductComponent} from "@models/product-component.model";
import {InventoryOperationType} from "@core/utils/operations/inventory-operation-type.enum";
import {ModifierService} from "@core/services/api/modifier.service";
import {ModifiersGroup} from "@models/modifier.model";
import {InventorySubmajorService} from "@core/services/api/InventorySubmajor.service";
import {ComponentSubmayor} from "@models/component-submayor.model";
import {ProductSubmajor} from "@models/product.submajor";
import {Scheduler} from "@models/scheduler.models";
import {SchedulerService} from "@core/services/api/scheduler.service";
import {SchedulerTime} from "@models/scheduler-time.model";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {SchedulerNotification} from "@models/scheduler-notification.model";
import {SchedulerType} from "@core/utils/scheduler-type.enum";
import {CustomerService} from "@core/services/api/customer.service";
import {catchError} from "rxjs/operators";
import {InfoCustomer} from "@models/info-user.model";
import {Customer} from "@models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  disableOp = false;

  private url = baseURL;

  constructor(private departmentService: DepartmentService,
              private productService: ProductService,
              private invoiceService: InvoiceService,
              private orderService: OrderService,
              private paymentService: PaymentService,
              private journeyService: JourneyService,
              private layoutService: LocalLayoutService,
              private configurationService: ConfigurationService,
              private adminOperationService: AdminOperationService,
              private clientService: ClientService,
              private tableService: TablesService,
              private inventoryService: InventoryService,
              private measureService: MeasureService,
              private categoryService: CategoryService,
              private stationService: StationService,
              private inventorySubmajorService: InventorySubmajorService,
              private modifierService: ModifierService,
              private schedulerService: SchedulerService,
              private customerService: CustomerService) {
  }

  // Departments
  getDepartments(): Observable<Department[]> {
    return this.departmentService.getAll(this.url);
  }

  getProductsByDepartment(department: string, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    return this.departmentService.getProductByDepartment(this.url, department, pageNumber, pageSize).pipe();
  }

  getSubDepartments(id: any): Observable<Department[]> {
    return this.departmentService.getSubDepartments(this.url, id);
  }

  getDepartmentById(id: any): Observable<Department> {
    return this.departmentService.getDepartmentById(this.url, id);
  }

  updateColorDept(id: string, color: string): Observable<Department[]> {
    return this.departmentService.updateDeptByAttr(this.url, id, color).pipe();
  }

  // Products
  getProductByUpc(upc: string, typeOp: EOperationType): Observable<Product[]> {
    // return this.productService.getProductByUpc(this.url, upc, typeOp).pipe(map(p => p[0]));
    return this.productService.getProductByUpc(this.url, upc, typeOp).pipe();
  }

  getProductsByUpc(upc: string, typeOp: EOperationType, pageNumber?: number, pageSize?: number): Observable<Product[]> {
    return this.productService.getProductByUpc(this.url, upc, typeOp, pageNumber, pageSize).pipe();
  }

  getOptionsProduct(id: string): Observable<IProductRestaurantDetails> {
    return this.productService.getOptionsProduct(this.url, id).pipe();
  }

  getProduct(id: string): Observable<Product> {
    return this.productService.getProduct(this.url, id).pipe();
  }

  getProductList(): Observable<Product[]> {
    return this.productService.getProductList(this.url).pipe();
  }

  updateProductByUpc(upc: string, price: string, id: string): Observable<Product[]> {
    return this.productService.updateProductByUpc(this.url, upc, id, price).pipe();
  }

  updateColorByUpc(upc: string, color: string, id: string): Observable<Product[]> {
    return this.productService.updateProductByAttr(this.url, upc, id, color, 'color').pipe();
  }

  updatePriceByUpc(upc: string, price: string, id: string): Observable<Product[]> {
    return this.productService.updateProductByAttr(this.url, upc, id, price, 'price').pipe();
  }

  // Invoice
  createInvoice(orderType?: ETXType, table?: string): Observable<Invoice> {
    return (!orderType) ?
      this.invoiceService.create(this.url) : this.createInvoiceWithOrder(orderType, table!);
  }

  createInvoiceWithOrder(orderType: ETXType, tableId: string): Observable<Invoice> {
    return this.invoiceService.createInvoiceWithOrder(this.url, orderType, tableId);
  }

  changeInvoiceToHold(invoice: Invoice, userName?: string): Observable<Invoice> {
    console.log(invoice, userName);
    return this.invoiceService.changeInvoiceToHold(this.url, invoice, userName);
  }

  changeInvoiceToInProgress(invoice: Invoice, userName?: string): Observable<Invoice> {
    console.log(invoice, userName);
    return this.invoiceService.changeInvoiceToInProgress(this.url, invoice, userName);
  }

  changeInvoiceToVoid(invoice: Invoice, userName?: string, isRefund = false): Observable<Invoice> {
    console.log(invoice);
    return this.invoiceService.changeInvoiceToVoid(this.url, invoice, userName);
  }

  changeInvoiceToRemoveHold(invoice: Invoice): Observable<any> {
    console.log(invoice);
    return this.invoiceService.changeInvoiceToRemoveHold(this.url, invoice);
  }

  /*getInvoiceInHold() {
    return this.invoiceService.getInvoiceByStatus(this.url, 'inHold');
  }

  getInvoiceCancelled() {
    return this.invoiceService.getInvoiceByStatus(this.url, 'cancel');
  }*/

  getInvoiceByStatus(status: InvoiceStatus) {
    return this.invoiceService.getInvoiceByStatus(this.url, status);
  }

  getStatusInvoices() {
    return this.invoiceService.getStatusInvoices(this.url);
  }

  getInvoiceById(id: string, operationType: EOperationType): Observable<Invoice> {
    console.log('getInvoiceById', id);
    return this.invoiceService.getById(this.url, id, operationType);
  }

  getByDateRange(fromDate: Date | string, toDate: Date | string, pageNumber: number, pageSize: number): Observable<Invoice[]> {
    return this.invoiceService.getByDateRange(this.url, fromDate, toDate, pageNumber, pageSize);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.invoiceService.getAllWithoutPage(this.url);
  }

  getInvoiceByIdRefund(id: string): Observable<Invoice> {
    return this.invoiceService.getInvoiceByIdRefund(this.url, id);
  }

  printInvoices(invoice: Invoice): Observable<Invoice[]> {
    return this.invoiceService.printInvoice(this.url, invoice);
  }

  send2Prepare(invoice: Invoice, userName?: string, note?: string): Observable<Invoice[]> {
    return this.invoiceService.prepareInvoice(this.url, invoice, userName, note);
  }

  send2PrepareAll(invoice: Invoice, userName?: string, note?: string): Observable<Invoice[]> {
    return this.invoiceService.prepareInvoiceAll(this.url, invoice, userName, note);
  }

  printLastInvoice(): Observable<any> {
    return this.invoiceService.printLastInvoice(this.url);
  }

  updateInvoice(invoice: Invoice, property: string, value: any) {
    return this.invoiceService.updateInvoice(this.url, invoice, property, value);
  }

  recallCheck(id: string): Observable<Invoice> {
    return this.invoiceService.recallCheck(this.url, id);
  }

  cancelCheck(id: string): Observable<Invoice> {
    return this.invoiceService.cancelCheck(this.url, id);
  }

  removeTip(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.removeTip(this.url, receiptNumber);
  }

  // ProductOrder

  addProductOrderByInvoice(invoiceId: string, productOrder: ProductOrder,
                           operationType: EOperationType, isRefund = false, username?: string): Observable<Invoice> {
    return this.invoiceService.addProductOrder(this.url, productOrder, invoiceId, operationType,
      isRefund, username);

  }

  deleteProductOrderByInvoice(invoiceId: string, productOrderId: string, isRefund = false): Observable<Invoice> {
    return this.invoiceService.deleteProductOrder(this.url, productOrderId, invoiceId);
  }

  deleteProductOrdersByInvoice(invoiceId: string, productOrders: ProductOrder[], isRefund = false,
                               userName?: string): Observable<Invoice> {
    return this.invoiceService.deleteProductOrders(this.url, productOrders, invoiceId, userName);
  }

  applyDiscountInvoice(id: string, discount: number, productOrderIds: Array<string>, discountType: EApplyDiscount): Observable<Invoice> {
    return this.invoiceService.applyDiscountInvoice(this.url, id, discount, productOrderIds, discountType);
  }

  subtotalInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.subtotalInvoice(this.url, receiptNumber);
  }

  fsSubtotalInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.fsSubtotalInvoice(this.url, receiptNumber);
  }

  getSelectedOptionsProduct(id: string, receiptNumber: string): Observable<IProductRestaurantDetails> {
    return this.invoiceService.getSelectedOptionsProduct(this.url, id, receiptNumber);
  }

  updateProductOrderByInvoice(po: ProductOrder[], receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.updateProductOrderByInvoice(this.url, po, receiptNumber);
  }

  editProductOrderByInvoice(receiptNumber: string, po: ProductOrder, Update: EOperationType) {
    return this.invoiceService.editProductOrderByInvoice(this.url, po, receiptNumber);
  }

  paidByCash(cashPayment: ICashPayment): Observable<any> {
    return this.paymentService.paidByCash(this.url, cashPayment);
  }

  paidByOnline(onlinePayment: IOnlinePayment): Observable<any> {
    return this.paymentService.paidByOnline(this.url, onlinePayment);
  }

  paidByCreditCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByCreditCard(this.url, cashPayment);
  }

  paidByDeditCard(cashPayment: CreditCard): Observable<any> {
    return this.paymentService.paidByDebitCard(this.url, cashPayment);
  }

  paidByEBTCard(cashPayment: CreditCard, type: number): Observable<any> {
    return this.paymentService.paidByEBTCard(this.url, cashPayment, type);
  }

  paidByCheck(check: CheckPayment): Observable<any> {
    return this.paymentService.paidByCheck(this.url, check);
  }

  paidByExternalCard(externalPayment: CardManualPayment, paymentMethod?: PaymentMethodEnum): Observable<any> {
    return this.paymentService.paymentExternalCardReader(this.url, externalPayment, paymentMethod);
  }

  getPaymentMedia(): Observable<any> {
    return this.paymentService.getPaymentMedia(this.url);
  }

  paidByGift(receiptNumber: string, gift: IGiftCardPaymentModel): Observable<any> {
    return this.paymentService.paidByGift(this.url, receiptNumber, gift);
  }

  paidByTransfer(transfer: ITransferPayment): Observable<any> {
    return this.paymentService.paidByTransfer(this.url, transfer);
  }

  // Journey
  registryOperation(journey: Journey): Observable<any> {
    return this.journeyService.registryOperation(this.url, journey);
  }

  // Configuration
  getConfiguration(): Observable<Configuration> {
    return this.configurationService.getAll(this.url);
  }

  setConfiguration(config: Configuration): Observable<Configuration> {
    return this.configurationService.setAll(config);
    //return this.configurationService.setAll(this.url, config);
  }

  // Admin Operations
  getApplicationUsers(): Observable<User[]> {
    return this.adminOperationService.getApplicationUsers(this.url);
  }

  getUsersPosition(): Observable<IPositionModel[]> {
    return this.adminOperationService.getUsersPosition(this.url);
  }

  addPaidOut(paidOut: PaidOut): Observable<any> {
    return this.adminOperationService.addPaidOut(this.url, paidOut);
  }

  getInvoiceByUserAndDate(id: string, date?: any, status?: string, payment?: number): Observable<IInvoicesByStates> {
    return this.adminOperationService.getInvoiceByUserAndDate(this.url, id, date, status, payment);
  }

  getPaymentByType(): Observable<Payment[]> {
    return this.adminOperationService.getPaymentByType(this.url);
  }

  printInvoiceByUser(id: string, date?: any, state?: string): Observable<any> {
    return this.adminOperationService.printInvoiceByUser(this.url, id, date, state);
  }

  printPaymentByType(): Observable<any> {
    return this.adminOperationService.printPaymentByType(this.url);
  }

  closeBatch(closeBatch: CloseBatch): Observable<any> {
    return this.adminOperationService.closeBatch(this.url, closeBatch);
  }

  getCloseBatchReport(closeBatch: CloseBatch): Observable<Report> {
    return this.adminOperationService.getCloseBatchReport(this.url, closeBatch);
  }

  updateProducts(): Observable<any> {
    return this.adminOperationService.updateProducts(this.url);
  }

  sendAck(msg: string): Observable<any> {
    return this.adminOperationService.sendAck(this.url, msg);
  }

  // Order
  getOrder(inv: string) {
    return this.orderService.getByInvoice(this.url, inv);
  }


  updateOrder(order: Order): Observable<Order> {
    return this.orderService.update(this.url, order);
  }

  getInvoicePayment(invoiceId: string): Observable<any> {
    return this.invoiceService.getInvoicePayment(this.url, invoiceId);
  }

  getTables(): Observable<Table[]> {
    return this.orderService.getTables(this.url);
  }

  // Report
  dayClose(close: boolean, date?: any) {
    const result = (date !== null && date !== undefined) ?
      this.adminOperationService.getDayClose(this.url, close, date.from) :
      this.adminOperationService.getDayClose(this.url, close);
    return result;
  }

  cashierClose(close: boolean, emp: string, date?: any) {
    const result = (date !== null && date !== undefined) ?
      this.adminOperationService.cashierCloseShift(this.url, close, emp, date.from) :
      this.adminOperationService.cashierCloseShift(this.url, close, emp);
    return result;
  }

  weeklyClosePrint(close?: boolean, from?: any, to?: any) {
    return this.adminOperationService.getWeeklyClosePrint(this.url, close, from, to);
  }

  rangeClosePrint(from: string, to: string): Observable<any> {
    return this.adminOperationService.getRangeClosePrint(this.url, from, to);
  }

  getInvoiceByTransferType(authPending: EOperationType, auth: ETransferType) {
    return this.invoiceService.getInvoiceByTransferType(this.url, auth);
  }

  getCloseReportsByDate(from?: string, to?: string): Observable<any> {
    return this.adminOperationService.getCloseReportsByDate(this.url, from!, to);
  }

  getCloseReport(from: any, to: any) {
    return this.adminOperationService.getCloseReport(this.url, from, to);
  }

  getCloseReportDaily(from: any, to: any) {
    return this.adminOperationService.getCloseReportDaily(this.url, from, to);
  }

  setUserToInvoice(invoiceId: any, userId: any): Observable<Invoice> {
    return this.invoiceService.setUser(this.url, invoiceId, userId);
  }

  // Other
  notSale(): Observable<any> {
    return this.adminOperationService.notSale(this.url);
  }

  inquiryEBTCard() {
    return this.paymentService.ebtInquiry(this.url);
  }

  weightItem(receiptNumber: string, price: number, weight?: number): Observable<Invoice> {
    return this.invoiceService.weightItem(this.url, receiptNumber, price, weight);
  }

  employSetup(employee: EmployeedModel) {
    return this.adminOperationService.employSetup(this.url, employee);
  }

  employClock(credentials: Credentials, clockType?: EClockType): Observable<UserClock> {
    return this.adminOperationService.employClock(this.url, credentials, clockType);
  }

  employUpdate(credential: Credentials) {
    return this.adminOperationService.employUpdate(this.url, credential);
  }

  employUpdatePass(credential: Credentials) {
    return this.adminOperationService.employUpdatePass(this.url, credential);
  }

  assignedCard(credential: Credentials) {
    return this.adminOperationService.assignedCard(this.url, credential);
  }

  employDelete(employId: string) {
    return this.adminOperationService.employDelete(this.url, employId);
  }

  // Clients
  clientSetup(client: Customer) {
    return this.clientService.setClient(this.url, client);
  }

  getClientById(id: string) {
    return this.clientService.getClientById(this.url, id);
  }

  getClients() {
    return this.clientService.getClients(this.url);
  }

  acctCharge(c: string, amount: number, receiptNumber: string) {
    return this.clientService.acctCharge(this.url, c, amount, receiptNumber);
  }

  acctPayment(client: string, payment: CardManualPayment | CheckPayment | TransferPayment, paymentMethod?: PaymentMethodEnum) {
    return this.clientService.acctPayment(this.url, client, payment, paymentMethod!);
  }

  clearInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.clearInvoice(this.url, receiptNumber);
  }

  printAcctBalance(client: string): Observable<any> {
    return this.clientService.printAcctBalance(this.url, client);
  }

  updateCreditLimit(client: string, credit: number) {
    return this.clientService.setCredit(this.url, client, credit);
  }

  setGiftCard(gift: IGiftModel): Observable<any> {
    return this.clientService.giftCard(this.url, gift);
  }

  validGiftCard(client: string, card: GiftCardModel): Observable<any> {
    return this.clientService.validGiftCard(this.url, client, card);
  }

  refundSale(receiptNumber: string) {
    return this.invoiceService.refundSale(this.url, receiptNumber);
  }

  getWorkerRecordsByUser(id: string, date: string): Observable<WorkerRecords[]> {
    return this.adminOperationService.getWorkerRecordsByUser(this.url, id, date);
  }

  getTimeWorkedByUser(id: string, date: string): Observable<string> {
    return this.adminOperationService.getTimeWorkedByUser(this.url, id, date);
  }

  // Stations
  getStationsStatus(): Observable<Array<Station>> {
    return this.stationService.getStatus(this.url);
  }

  getLocalLayout(): Observable<LocalLayout[]> {
    return this.layoutService.getLocalLayout(this.url)
  }

  setTable(table: Table): Observable<Table> {
    return this.tableService.setTable(this.url, table);
  }

  updateTable(table: Table): Observable<any> {
    return this.tableService.updateTable(this.url, table.id, table);
  }

  getTable(id: string): Observable<Table> {
    return this.tableService.getTable(this.url, id);
  }

  getTableByUser(id: string): Observable<Table[]> {
    return this.tableService.getTableByUser(this.url, id);
  }

  getTableAllUser(): Observable<Table[]> {
    return this.tableService.getTableAllUser(this.url);
  }

  updateTableAll(table: Table[]): Observable<Table[]> {
    return this.tableService.updateAllTable(this.url, table);
  }

  getTablesLocationUser(layout: string, userId: string): Observable<Table[]> {
    return this.tableService.getTablesLocationUser(this.url, layout, userId)
  }

  getLocalLayoutByUser(posUserId: string) {
    return this.layoutService.getLocalLayoutByUser(this.url, posUserId);
  }

  getTablesLocation(layoutId: string): Observable<Table[]> {
    return this.tableService.getTablesLocation(this.url, layoutId);
  }

  addNoteInvoice(receiptNumber: string, noteInvoice: string) {
    return this.invoiceService.addNoteInvoice(this.url, receiptNumber!, noteInvoice!);
  }

  addPrepareNoteInvoice(receiptNumber: string, prepareNoteInvoice: string) {
    return this.invoiceService.addPrepareNoteInvoice(this.url, receiptNumber!, prepareNoteInvoice!);
  }

  deleteInvoice(receiptNumber: string): Observable<Invoice> {
    return this.invoiceService.deleteInvoice(this.url, receiptNumber!);
  }

  tipAuthorization(paymentMethod: any, paymentInvoice: PaymentInvoice) {
    return this.invoiceService.tipAuthorization(this.url, paymentMethod, paymentInvoice);
  }

  aggregateCustomerInvoice(invoiceId: string, customerId: string): Observable<Invoice> {
    return this.invoiceService.aggregateCustomerInvoice(this.url, invoiceId, customerId);
  }

  createUser(employee: any): Observable<User> {
    return this.adminOperationService.employSetup(this.url, employee);
  }

  updateUser(employee: any): Observable<User> {
    return this.adminOperationService.employUpdate(this.url, employee);
  }

  deleteUser(id: string): Observable<User> {
    return this.adminOperationService.employDelete(this.url, id);
  }

  /* InventoryModel */

  getInventory(): Observable<Inventory[]> {
    return this.inventoryService.getInventory(this.url);
  }

  getInventoryId(id: string): Observable<Inventory> {
    return this.inventoryService.getInventoryId(this.url, id);
  }

  postInventory(inventory: Inventory): Observable<Inventory[]> {
    return this.inventoryService.postInventory(this.url, inventory);
  }

  putInventory(inventory: Inventory): Observable<Inventory[]> {
    return this.inventoryService.putInventory(this.url, inventory);
  }

  deleteInventory(id: string): Observable<Inventory[]> {
    return this.inventoryService.deleteInventory(this.url, id);
  }

  addProductComponents(productComponent: ProductComponent) {
    return this.inventoryService.addProcuctComponents(this.url, productComponent);
  }

  getProductComponents(productId: string) {
    return this.inventoryService.getProductComponents(this.url, productId);
  }

  delProductComponents(productId: string, componentId: string) {
    return this.inventoryService.delProductComponents(this.url, productId, componentId);
  }

  getMeasures(): Observable<Measure[]> {
    return this.measureService.getMeasures(this.url);
  }

  getAssociatedMeasures(idMeasure: string) {
    return this.measureService.getAssociatedMeasures(this.url, idMeasure);
  }

  getCategories(): Observable<Category[]> {
    return this.categoryService.getCategories(this.url);
  }

  delProduct(productId: string) {
    return this.productService.delProduct(this.url, productId);
  }

  postProduct(product: Product) {
    return this.productService.postProduct(this.url, product);
  }

  putProduct(product: Product) {
    return this.productService.putProduct(this.url, product);
  }

  adjustComponent(id: string, formOperation: InventoryOperationType, formUnitCost: number,
                  formUnitInStock: number, formNote: string) {
    return this.inventoryService.adjustComponent(this.url, id, formOperation, formUnitCost, formUnitInStock, formNote);
  }


  /* Modifier */

  getModifierGroupById(modifierGroupById: string): Observable<ModifiersGroup> {
    return this.modifierService.getModifierGroupById(this.url, modifierGroupById);
  }

  getModifierGroup(): Observable<ModifiersGroup[]> {
    return this.modifierService.getModifierGroup(this.url)
  }

  posModifierGroup(description: string, price: number, number: number): Observable<ModifiersGroup[]> {
    return this.modifierService.posModifierGroup(this.url, description, price, number)
  }

  deleteModifierGroup(id: string) {
    return this.modifierService.deleteModifierGroup(this.url, id)
  }

  putModifierGroup(modifierGroup: ModifiersGroup) {
    return this.modifierService.putModifierGroup(this.url, modifierGroup)
  }

  getModifiers(): Observable<Aggregate[]> {
    return this.modifierService.getModifiers(this.url)
  }

  posProductToModifierGroup(idProduct: string, idModifierGroup: string, price: number): Observable<ModifiersGroup> {
    return this.modifierService.posProductToModifierGroup(this.url, idProduct, idModifierGroup, price)
  }

  posMenuToGroupProduct(idMenu: string, idModifierGroup: string, price: number): Observable<ModifiersGroup[]> {
    return this.modifierService.posMenuToGroupProduct(this.url, idMenu, idModifierGroup, price)
  }

  deleteElementModifierGroup(modifierId: string, aggregateId: string): Observable<ModifiersGroup> {
    return this.modifierService.deleteElementModifierGroup(this.url, modifierId, aggregateId)
  }

  getModifierGroupByProduct(idProduct: string) {
    return this.modifierService.getModifierGroupByProduct(this.url, idProduct)
  }

  deleteModifierGroupByMenu(idMenu: string, idModifierGroup: string) {
    return this.modifierService.deleteModifierGroupByMenu(this.url, idMenu, idModifierGroup)
  }

  getBestSellers(from: string, to: string, top: number): Observable<any> {
    return this.adminOperationService.getBestSelledProuct(this.url, from!, to, top);
  }

  getCloseDayReportsByDate(from: string, to: string): Observable<any> {
    return this.adminOperationService.getCloseDayReportsByDate(this.url, from!, to);
  }

  getProductSubmajor(productId: string, startDate: string, endDate: String): Observable<ComponentSubmayor[]> {
    return this.inventorySubmajorService
      .getProductSubmajor(this.url, productId, startDate, endDate)
  }

  getMenuSubmajor(productId: string, startDate: string, endDate: String): Observable<ProductSubmajor[]> {
    return this.inventorySubmajorService
      .getMenuSubmajor(this.url, productId, startDate, endDate)
  }

  /* Scheduler */
  getScheduler(activeModule: SchedulerType): Observable<Scheduler[]> {
    return this.schedulerService.getScheduler(this.url, activeModule)
  }

  createScreduler(scheduler: Scheduler): Observable<Scheduler> {
    return this.schedulerService.createScreduler(this.url, scheduler);
  }

  deleteScreduler(id: string) {
    return this.schedulerService.deleteScreduler(this.url, id);
  }


  updateScheduler(scheduler: Scheduler): Observable<Scheduler[]> {
    return this.schedulerService.updateScheduler(this.url, scheduler);
  }

  createScredulerTime(schedulerTime: SchedulerTime): Observable<Scheduler> {
    return this.schedulerService.createScredulerTime(this.url, schedulerTime);
  }

  deleteSchedulerTime(schedulerTime: SchedulerTime) {
    return this.schedulerService.deleteSchedulerTime(this.url, schedulerTime);
  }

  addSchedulerProduct(schedulerProduct: SchedulerProduct) {
    return this.schedulerService.addSchedulerProduct(this.url, schedulerProduct);
  }

  deleteSchedulerProduct(schedulerProduct: SchedulerProduct) {
    return this.schedulerService.deleteSchedulerProduct(this.url, schedulerProduct);
  }

  forceExecutionScheduler(): Observable<SchedulerNotification[]> {
    return this.schedulerService.forceExecutionScheduler(this.url);
  }

  pendingInvoice(statusInvoice: InvoiceStatus[]) {
    return this.invoiceService.pendingInvoice(this.url, statusInvoice);
  }


  /* Customer */

  getAllCustomer(): Observable<Customer[]> {
    return this.customerService.getAllCustomer(this.url)
  }

  getCustomer(idCustomer: string): Observable<Customer> {
    return this.customerService.getCustomer(this.url, idCustomer)
  }

  deleteCustomerId(idCustomer: string): Observable<Customer> {
    return this.customerService.deleteCustomer(this.url, idCustomer)
  }

  addCustomer(customer: Customer): Observable<Customer[]> {
    return this.customerService.addCustomer(this.url, customer)
  }

  updateCustomer(customer: Customer): Observable<Customer[]> {
    return this.customerService.updateCustomer(this.url, customer)
  }

  customerSalesReport(id: string, fromDate: string, toDate: string): Observable<InfoCustomer> {
    return this.customerService.customerSalesReport(this.url, id, fromDate, toDate)
  }

  adjustProduct(id: string, formOperation: InventoryOperationType, formUnitCost: number, formUnitInStock: number, formNote: string) {
    return this.productService.adjustProduct(this.url, id, formOperation, formUnitCost, formUnitInStock, formNote)
  }

  updateStateTable(): Observable<any> {
    return this.tableService.updateStateTable(this.url)
  }
}
