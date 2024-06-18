import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from '../api/auth.service';
import {DataStorageService} from '../api/data-storage.service';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {map} from 'rxjs/operators';
import {EOperationType} from '../../utils/operation.type.enum';
import {CashService} from './cash.service';
import {PaymentStatus} from '../../utils/payment-status.enum';
import {ETXType} from '../../utils/delivery.enum';
import {EApplyDiscount} from '../../utils/apply-discount.enum';
import {CardTypes} from '../../utils/card-payment-types.enum';
import {PaymentMethodEnum} from '../../utils/operations/payment-method.enum';
import {InformationType} from '../../utils/information-type.enum';
import {MatDialogRef} from '@angular/material/dialog';
import {CompanyType} from '../../utils/company-type.enum';
import {EFieldType} from '../../utils/field-type.enum';
import {Router} from '@angular/router';
import {Invoice} from '@models/invoice.model';
import {Client, Order} from "@models/order.model";
import {ProductOrder} from "@models/product-order.model";
import {Product} from "@models/product.model";
import {IProductRestaurantDetails} from "@models/product-restaurant-details.model";
import {PaymentOpEnum, StatusTable} from "@core/utils/operations";
import {CashPaymentModel} from "@models/cash-payment.model";
import {CardManualPayment, CreditCardModel, SwipeMethod} from "@models/credit-card.model";
import {PaidOut} from "@models/paid-out.model";
import {Table} from "@models/table.model";
import {CheckPayment} from "@models/check.model";
import {TransferPayment} from "@models/transfer.model";
import {GiftCardPayment} from "@models/gift-card.model";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {OnlinePayment} from "@models/online.model";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {SelectionModel} from "@angular/cdk/collections";
import {OperationType} from "@models/operation-type";
import {PaymentInvoice} from "@models/financials/payment-invoice.model";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  receiptNumber!: string;
  cashier!: string;
  // For manage numpadInput
  digits = '';
  numbers = '';
  qty = 1;
  invoice!: Invoice | null;
  order!: Order | undefined
  //table! : Table | undefined;
  invoiceProductSelected: any[] = [];
  isReviewed!: boolean;
  isRecalled!: boolean;
  isCreating!: boolean;
  priceWic!: string;
  restaurantTableId!: string;
  txType: ETXType | null = ETXType.DINEIN;
  positionTable?: number = 1;
  note?: string;
  invoice$: Subject<Invoice> = new BehaviorSubject<Invoice>({} as any);
  order$: Subject<Order | undefined> = new BehaviorSubject<Order | undefined>(this.order!);
  deleteProdRefund: boolean = true;

  items: OperationType[] = [
    {title: "Create", id: InvoiceStatus.CREATED},
    {title: "Progress", id: InvoiceStatus.IN_PROGRESS},
    {title: "Hold", id: InvoiceStatus.IN_HOLD},
    {title: "Paid", id: InvoiceStatus.PAID},
    {title: "Cancel", id: InvoiceStatus.CANCEL},
    {title: "Refund", id: InvoiceStatus.REFUND},
    {title: "Pendent payment", id: InvoiceStatus.PENDENT_FOR_PAYMENT}
  ]

  public selectionModel =
    new SelectionModel<OperationType>(true, [this.items[0], this.items[1], this.items[2]]);

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evChkPriceProdByUPC = new EventEmitter<any>();
  @Output() evUpdateTotals = new EventEmitter<any>();
  @Output() evUpdateProds = new EventEmitter<ProductOrder[]>();
  @Output() evEditRestaurantOp = new EventEmitter<any>();
  @Output() evCreateInvoice = new EventEmitter<boolean>(false);
  @Output() evSelectedTable = new EventEmitter<Table>();
  @Output() evNewInvoice = new EventEmitter<boolean>(false);

  lastProdAdd!: ProductOrder | null;
  evSetOrder = new BehaviorSubject<ETXType>(ETXType.RETAIL);
  evTableLayot = new BehaviorSubject<boolean>(false);

  constructor(public authService: AuthService, private dataStorage: DataStorageService, public cashService: CashService,
              private dialogService: DialogService,
              public tableService: TablesService,
              private searchService: SearchService,
              private router: Router) {
  }

  get getInvoiceTable() {
    return this.order?.table!
  }

  get getInvoiceCustomer() {
    return this.order && this.order!.client!
  }

  get disableVoid() {
    const invoiceStatus = [
      InvoiceStatus.PAID, InvoiceStatus.CANCEL, InvoiceStatus.REFUND];

    const paymentStatus = [PaymentStatus.REFUND]

    return !this.invoice;

    /*
    return this.invoice ?
      (
        this.invoice?.isRefund! ||
        invoiceStatus.includes(this.invoice?.status!) ||
        paymentStatus.includes(this.invoice?.paymentStatus!) ||
        (this.invoice?.productOrders && this.invoice?.productOrders.length === 0)
      ) :
      true;
     */
  }

  get disableCheckout() {
    const invoiceStatus = [InvoiceStatus.CANCEL, InvoiceStatus.PAID];

    return invoiceStatus.includes(this.invoice?.status!) ||
      (this.invoice === undefined || this.invoice === null) ||
      (this.invoice?.productOrders && (this.invoice?.productOrders.length === 0 && !this.invoice?.isRefund))
    //(this.invoice?.isRefund && this.deleteProdRefund);
  }

  /* enabled actions */
  get disableHold() {
    const invStatus = [InvoiceStatus.CANCEL, InvoiceStatus.PAID, InvoiceStatus.REFUND];
    const payStatus = [PaymentStatus.REFUND, PaymentStatus.VOID];

    return invStatus.includes(this.invoice?.status!) ||
      payStatus.includes(this.invoice?.paymentStatus!) ||
      this.invoice === undefined || this.invoice === null ||
      this.invoice!.productOrders!.length! === 0
  }

  resetSelection() {
    this.selectionModel.clear();
    this.selectionModel.select(this.items[0], this.items[1], this.items[2]);

  }

  getInvoice$(): Observable<Invoice> {
    return this.invoice$.asObservable();
  }

  getOrderObservable$(): Observable<Order | undefined> {
    return this.order$.asObservable()
  }

  setOrderEmit(order?: Order) {
    this.order = order;
    return this.order$.next(order);
  }

  getUpdateInvoice() {
    this.invoice$.next(this.invoice!);
  }

  getCashier(): string {
    return this.cashier = (this.authService.token && this.authService.token.username) ? this.authService.token.username : '';
  }

  getUserId(): string {
    return (this.authService.token && this.authService.token.user_id) ? this.authService.token.user_id : '';
  }

  isNullInvoice() {
    return this.invoice === null ||
      this.receiptNumber === undefined ||
      this.receiptNumber.trim() === ""
  }

  createInvoice(orderType?: ETXType, table?: string, callback?: (i?: any) => void, gotoPage?: boolean) {
    this.isCreating = true;
    const opMsg = 'create invoice';
    let dialogInfoEvents: any;
    setTimeout(() => {
      if (this.isCreating) {
        //dialogInfoEvents = this.dialogService.openGenericInfo(InformationType.INFO, 'Creating invoice...',
        //  undefined, undefined, true);
        //dialogInfoEvents = this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, undefined, 'Creating' +
        //  ' invoice...', undefined, DialogConfirm.BTN_NONE);
        dialogInfoEvents = this.dialogService.openDialogWait("Creating invoice...");
      }
    }, 1000);
    const $creating = this.dataStorage.createInvoice(orderType, table).subscribe(next => {
      //debugger;
      console.log('createCheck successfull', next);
      this.isCreating = false;
      if (!orderType) this.txType = orderType!;
      if (dialogInfoEvents) {
        dialogInfoEvents.close();
      }
      this.receiptNumber = next.receiptNumber;
      this.invoice = <Invoice>next;
      this.order = undefined;
      this.note = undefined;
      this.isReviewed = false;
      this.evDelAllProds.emit();
      this.lastProdAdd = null;
      this.setTotal();
      this.evCreateInvoice.next(true);
      this.evNewInvoice.next(true);
      this.setOrderEmit(this.order!);
      this.getUpdateInvoice();
      if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT &&
        next.status === InvoiceStatus.IN_HOLD) {
        this.isRecalled = true;
      }
      if (callback) {
        callback(next);
      } else {
        if ((this.cashService.config?.sysConfig?.companyType! === CompanyType.RESTAURANT) &&
          (this.txType! === ETXType.DINEIN)) {
          this.router.navigateByUrl("/home/layout/tables")
        }
      }
      this.cashService.setOperation(EOperationType.CreateInvoice, 'Invoice', 'Created invoice ' + next.receiptNumber);
    }, err => {
      console.error('createCheck failed');
      this.isCreating = false;
      if (dialogInfoEvents) {
        dialogInfoEvents.close();
      }
      //clearTimeout(timeOut);
      this.dialogService.openGenericInfo('Error', err)!.afterClosed().subscribe(
        (next: any) => {
          this.evCreateInvoice.next(false);
        });
      this.cashService.setOperation(EOperationType.CreateInvoice, 'Invoice', 'Create invoice failed');
    });
    //const timeOut = this.operationTimeOut($creating, dialogInfoEvents, opMsg);
    this.getUpdateInvoice();
    /*
      if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT
        && this.router.url !== '/restaurant' && this.router.url !== '/cash/options') {
        debugger;
        this.evTableLayot.next(true);
        //this.getUpdateInvoice();
      } else {
        this.isCreating = true;
        const opMsg = 'create invoice';
        let  dialogInfoEvents : any;
        setTimeout(() => {
          if (this.isCreating) {
            dialogInfoEvents = this.dialogService.openGenericInfo(InformationType.INFO, 'Creating invoice...',
              undefined, undefined, true);
          }
        }, 1000);
        const $creating = this.dataStorage.createInvoice(orderType, table).subscribe(next => {
          console.log('createCheck successfull', next);
          this.isCreating = false;
          if (dialogInfoEvents) { dialogInfoEvents.close(); }
          clearTimeout(timeOut);
          this.receiptNumber = next.receiptNumber;
          this.invoice = <Invoice> next;
          this.order = undefined;
          this.table = undefined;
          this.isReviewed = false;
          this.evDelAllProds.emit();
          this.lastProdAdd = null;
          this.setTotal();
          this.evCreateInvoice.next(true);
          this.evNewInvoice.next(true);
          if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT &&
            next.status === InvoiceStatus.IN_HOLD) {
              this.isRecalled = true;
          }
          if (callback) { callback(next); }
          this.cashService.setOperation(EOperationType.CreateInvoice, 'Invoice', 'Created invoice ' + next.receiptNumber);
        }, err => {
          console.error('createCheck failed');
          this.isCreating = false;
          if (dialogInfoEvents) { dialogInfoEvents.close(); }
          clearTimeout(timeOut);
          this.dialogService.openGenericInfo('Error', err).afterClosed().subscribe(
            (next : any) => {
              this.evCreateInvoice.next(false);
            });
          this.cashService.setOperation(EOperationType.CreateInvoice, 'Invoice', 'Create invoice failed');
        });

        const timeOut = this.operationTimeOut($creating, dialogInfoEvents, opMsg);
        this.getUpdateInvoice();
      }
     */
  }

  operationTimeOut($op: Subscription, dialogInfoEvents: MatDialogRef<any, any>, opMsg: string): number {
    // @ts-ignore
    return setTimeout(() => {
      if (dialogInfoEvents) {
        dialogInfoEvents.close();
      }
      $op.unsubscribe();
      this.cashService.evLogout.emit(true);
    }, 10000);
  }

  addProductOrder(po: ProductOrder) {
    this.dataStorage.addProductOrderByInvoice(this.invoice!.receiptNumber, po, EOperationType.Add, this.invoice!.isRefund)
      .subscribe(next => {
        console.log('addProductOrder-next', next);
        if (next.productOrders.length > 0) {
          this.setInvoice(next)
        }
        /*
        (next.productOrders.length > 0 && next.total >= this.invoice.total) ?
           this.setInvoice(next):
          (next.isRefund) ? this.setInvoice(next) : this.addPO2Invoice(next) :
          this.showErr('The invoice hasn\'t products', next);
        */
      }, err => {
        this.showErr(err);
      });
  }

  warnInvoicePaid() {
    console.log('this invoice is paid', this.invoice);
    this.dialogService.openGenericInfo(InformationType.INFO, 'The invoice was paid');
    //this.createInvoice();
    this.cashService.resetEnableState();
  }

  updateClientAge(clientAge: number) {
    this.invoice!.clientAge = clientAge;
    this.dataStorage.updateInvoice(this.invoice!, 'clientAge', clientAge)
      .subscribe(data => console.log(data), err => console.log(err));
  }

  addPO2Invoice(inv: Invoice) {
    this.invoice!.status = inv.status;
    this.invoice!.paymentStatus = inv.paymentStatus;
    this.invoice!.productOrders.push(inv.productOrders[0]);
    this.lastProdAdd = inv.productOrders[0];
    this.updateTotals(inv);
    this.evAddProd.emit(inv.productOrders[0]);
    this.resetDigits();
    this.getUpdateInvoice();
  }

  updateTotals(inv: Invoice) {
    this.invoice!.subTotal = inv.subTotal;
    this.invoice!.tax = inv.tax;
    this.invoice!.total = inv.total;
    this.invoice!.fsTotal = inv.fsTotal;
    this.invoice!.balance = inv.balance;
    this.setTotal();
  }

  delPOFromInvoice(po: ProductOrder[]) {
    this.dataStorage.deleteProductOrdersByInvoice(this.invoice!.receiptNumber, po, this.invoice!.isRefund)
      .subscribe(next => {
        //next.productOrders = next.productOrders.filter( p => p.id !== po.id);
        console.log('delPOFromInvoice-next', next);
        if (this.invoice!.isRefund) this.deleteProdRefund = false;
        this.setInvoice(next);
        //this.deleteProduct = true;
      }, err => {
        this.showErr(err);
      });


  }

  addProductByUpc(typeOp: EOperationType): Observable<Product[]> {
    return this.getProductByUpc(typeOp);
  }

  holdOrder(userName?: string): Observable<any> {
    return this.dataStorage.changeInvoiceToHold(this.invoice!, userName)
      .pipe(map((next: any) => {
        this.tableService.setTableStatus(StatusTable.BUSY);
      }));
  }

  InProgressOrder(userName?: string): Observable<any> {
    return this.dataStorage.changeInvoiceToInProgress(this.invoice!, userName)
      .pipe(map((next: any) => {
        this.tableService.setTableStatus(StatusTable.BUSY);
      }));
  }

  voidOrder(i: Invoice): Observable<any> {
    // this.setUserToInvoice();
    return this.dataStorage.changeInvoiceToVoid(i);
  }

  removeHoldOrder(i: Invoice): void {
    // this.setUserToInvoice();
    this.dataStorage.changeInvoiceToRemoveHold(i).subscribe(
      next => {
        console.log(next);
        this.resetDigits();
        //this.createInvoice();
        this.cashService.resetEnableState();
      },
      err => {
        console.error(err);
        this.dialogService.openGenericInfo('Error', err);
      });
  }

  recallCheck(): Observable<Invoice> {
    return this.dataStorage.recallCheck(this.digits);
  }

  getInvoiceByStatus(typeOp: EOperationType, status?: InvoiceStatus): Observable<Invoice[]> {
    if (status === InvoiceStatus.IN_HOLD || status === InvoiceStatus.CANCEL) {
      return this.dataStorage.getInvoiceByStatus(status).pipe(map(invoices => invoices));
    } else {
      return this.dataStorage.getInvoices().pipe(map(invoices => invoices));
    }
  }

  getInvoicesById(typeOp: EOperationType, id?: string): Observable<Invoice> {
    console.log('Recall by InvoiceId: ', this.digits);
    return this.dataStorage.getInvoiceById(id ? id : this.digits, typeOp);
  }

  getProductByUpc(typeOp: EOperationType, upc?: string): Observable<Product[]> {
    return this.dataStorage.getProductByUpc(upc ? upc : this.numbers, typeOp);
  }

  getOptionsProduct(id: string): Observable<IProductRestaurantDetails> {
    return this.dataStorage.getOptionsProduct(id);
  }

  getProduct(id: string): Observable<Product> {
    return this.dataStorage.getProduct(id);
  }

  getSelectedOptionsProduct(id: string): Observable<IProductRestaurantDetails> {
    return this.dataStorage.getSelectedOptionsProduct(id, this.receiptNumber);
  }

  updateProductsPrice(upc: string, price: string, id: string) {
    return this.dataStorage.updateProductByUpc(upc, price, id);
  }

  updateDepartmentColor(color: string, id: string): Observable<any> {
    return this.dataStorage.updateColorDept(id, color);
  }

  updateProductsColor(upc: string, color: string, id: string) {
    return this.dataStorage.updateColorByUpc(upc, color, id);
  }

  setInvoice(inv: Invoice) {
    console.log('setting invoice', inv);
    this.invoice = inv;
    this.receiptNumber = this.invoice!.receiptNumber;
    this.order = inv.order!;

    if (this.order!.orderType === ETXType.DINEIN) {
      this.txType = ETXType.DINEIN;
      this.setTotal();
      this.evUpdateProds.emit(this.invoice!.productOrders);
      this.evCreateInvoice.emit(true);
      this.resetDigits();
      this.getUpdateInvoice();
      this.setOrderEmit(this.order);
    } else {
      this.txType = ETXType.FAST_FOOD;
      this.setTotal();
      this.evUpdateProds.emit(this.invoice.productOrders);
      this.evCreateInvoice.emit(true);
      this.invoice!.order = undefined;
      this.setOrderEmit(this.invoice!.order!);
      this.resetDigits();
      this.getUpdateInvoice();
    }
  }

  resetDigits() {
    console.log('resetDigits');
    this.digits = '';
    this.numbers = '';
    this.qty = 1;
    this.getUpdateInvoice();
  }

  removeInvoice() {
    console.log('removeInvoice');
    this.invoice = null;
    this.order = undefined;
    this.receiptNumber = '';
    this.getUpdateInvoice();
    this.setOrderEmit(this.order!);
    this.evCreateInvoice.emit(true);
  }

  cancelInvoice(user?: string): Observable<Invoice> {
    return this.dataStorage.changeInvoiceToVoid(this.invoice!)
  }

  cash(payment: number, totalToPaid: number, type: PaymentOpEnum = PaymentOpEnum.CASH, tips?: number): Observable<Invoice> {
    const cashPayment =
      new CashPaymentModel(this.invoice!.receiptNumber, totalToPaid, payment, type, tips!);
    return this.dataStorage.paidByCash(cashPayment);
  }

  getInvoicePayment(invoiceId: string): Observable<any> {
    return this.dataStorage.getInvoicePayment(invoiceId);
  }

  cashOnline(payment: number, confirmCode: string, totalToPaid: number, type: PaymentOpEnum, tips?: number): Observable<Invoice> {
    const onlinePayment =
      new OnlinePayment(payment, this.invoice!.receiptNumber, confirmCode, type,
        tips!, totalToPaid, PaymentOpEnum.ONLINE);
    return this.dataStorage.paidByOnline(onlinePayment);
  }

  debit(payment: number, tip?: number, transferType?: PaymentStatus, receiptNumber?: string): Observable<Invoice> {
    const debitPayment = new CreditCardModel(payment, tip,
      receiptNumber ? receiptNumber : this.invoice!.receiptNumber, transferType);
    return this.dataStorage.paidByDeditCard(debitPayment);
  }

  credit(payment: number, tip?: number, transferType?: PaymentStatus, receiptNumber?: string): Observable<Invoice> {
    const creditPayment = new CreditCardModel(payment, tip,
      receiptNumber ? receiptNumber : this.invoice!.receiptNumber, transferType);
    return this.dataStorage.paidByCreditCard(creditPayment);
  }

  creditManual(payment: number, tip?: number, ccnumber?: string, cvv?: string, ccdate?: string, zip?: string,
               street?: string): Observable<Invoice> {
    const creditPayment = new CreditCardModel(payment, tip, this.invoice!.receiptNumber, PaymentStatus.SALE, ccnumber, cvv,
      ccdate, SwipeMethod.MANUAL, zip, street);
    return this.dataStorage.paidByCreditCard(creditPayment);
  }

  ebt(payment: number, type: number, tip?: number, transferType?: PaymentStatus): Observable<Invoice> {
    const ebtPayment = new CreditCardModel(payment, tip, this.invoice!.receiptNumber, transferType);
    return this.dataStorage.paidByEBTCard(ebtPayment, type);
  }

  ebtInquiry() {
    return this.dataStorage.inquiryEBTCard();
  }

  externalCard(payment: number, accountNumber?: string, authCode?: string, cardType?: string | CardTypes, client?: any,
               paymentMethod?: PaymentMethodEnum): Observable<Invoice> {
    const cardPayment = new CardManualPayment(payment, PaymentStatus.SALE, this.invoice!.receiptNumber, accountNumber!,
      authCode!, cardType!);
    return (client) ? this.dataStorage.acctPayment(client, cardPayment, PaymentMethodEnum.CREDIT_CARD) :
      this.dataStorage.paidByExternalCard(cardPayment, paymentMethod);
  }

  getExternalCadTypes(): Observable<any> {
    return this.dataStorage.getPaymentMedia();
  }

  print(invoice: Invoice) {
    return this.dataStorage.printInvoices(invoice);
  }

  send2Prepare(invoice: Invoice, userName?: string, note?: string) {
    return this.dataStorage.send2Prepare(invoice, userName, note);
  }

  send2PrepareAll(invoice: Invoice, userName?: string, note?: string) {
    return this.dataStorage.send2PrepareAll(invoice, userName, note);
  }

  refund(): Observable<Invoice> {
    return this.dataStorage.getInvoiceByIdRefund(this.digits);
  }

  setTotal() {
    this.evUpdateTotals.emit(true);
  }

  computeTotal() {
    let total = 0;
    let subtotal = 0;
    let tax = 0;
    let taxes = 0;
    this.invoice!.productOrders.map(p => {
      subtotal = p.unitCost * p.quantity;
      total += subtotal;
      if (p.tax !== 0) {
        tax = p.tax /** subtotal / 100*/;
        taxes += tax;
      }
    });
    return {total: total, taxes: taxes};
  }

  printLastInvoice() {
    this.dataStorage.printLastInvoice()
      .subscribe(data => data, error1 => {
        this.dialogService.openGenericInfo(InformationType.ERROR, error1);
      });
  }

  applyDiscountInvoice(discount: number, type: EApplyDiscount): Observable<Invoice> {
    let idProdOrders = new Array<string>();
    idProdOrders = this.invoiceProductSelected.map(v => v.id);
    console.log('applyDiscountInvoice', this.invoiceProductSelected, idProdOrders);
    console.log('applyDiscountType', discount, type);
    return this.dataStorage.applyDiscountInvoice(this.invoice!.receiptNumber, discount, idProdOrders, type);
  }

  addPaidOut(data: string, descrip?: string, type?: any, userId?: string): Observable<any> {
    return this.dataStorage.addPaidOut(new PaidOut(+data, descrip, type, userId));
  }

  cancelCheck() {
    this.dataStorage.cancelCheck(this.invoice!.receiptNumber).subscribe(
      next => {
        console.log(next);
        this.resetDigits();
        //this.createInvoice();
        this.cashService.resetEnableState();
      },
      err => {
        console.error(err);
        this.dialogService.openGenericInfo('Error', 'Can\'t complete cancel check operation');
      });

  }

  setDineIn(table: Table): Observable<Order> {
    const createOrder = (table: any) =>
      new Order(this.invoice!.id, ETXType.DINEIN, undefined, undefined, table.id, table);

    return this.dataStorage.updateOrder(createOrder(table));
  }

  setRetail(): Observable<Order> {
    const createOrder = () => new Order(this.invoice!.id, ETXType.RETAIL);
    return this.dataStorage.updateOrder(createOrder());
  }

  setPickUp(data: string, text: any, descrip: any): Observable<Order> {
    const createOrder = (name: any, tel: any) =>
      new Order(this.invoice!.id, ETXType.PICKUP, undefined, new Client(name, tel),
        undefined, undefined, undefined, descrip);
    return this.dataStorage.updateOrder(createOrder(data, text));
  }

  setDelivery(name: any, address: any, phone: any, descrip?: any): Observable<Order> {
    const createOrder = (name: any, address: any, phone: any, descrip: any) => {
      return new Order(this.invoice!.id, ETXType.PICKUP, undefined, new Client(name, phone),
        undefined, undefined, undefined, descrip);
    };
    return this.dataStorage.updateOrder(createOrder(name, address, phone, descrip));
  }

  tables(): Observable<Table[]> {
    return this.dataStorage.getTables();
  }

  setUser(userId: any): Observable<Invoice> {
    return this.dataStorage.setUserToInvoice(this.invoice!.receiptNumber, userId);
  }

  notSale(): Observable<any> {
    return this.dataStorage.notSale();
  }

  weightItem(price: number, weight?: number): Observable<Invoice> {
    return this.dataStorage.weightItem(this.invoice!.receiptNumber, price, weight);
  }

  acctCharge(c: string, amount: number): Observable<Invoice> {
    return this.dataStorage.acctCharge(c, amount, this.receiptNumber);
  }

  acctPaymentCash(client: any, amount: any) {
    const cashPayment = new CardManualPayment(amount, undefined, null, null, null, "");
    return this.dataStorage.acctPayment(client, <CardManualPayment>cashPayment, PaymentMethodEnum.CASH);
  }

  subTotal(): Observable<Invoice> {
    return this.dataStorage.subtotalInvoice(this.receiptNumber);
  }

  fsSubTotal(): Observable<Invoice> {
    return this.dataStorage.fsSubtotalInvoice(this.receiptNumber);
  }

  clear(): Observable<Invoice> {
    return this.dataStorage.clearInvoice(this.receiptNumber);
  }

  paidByCheck(amount: number, checkNumber: string, descrip?: string, client?: string): Observable<Invoice> {
    const checkPayment = new CheckPayment(this.invoice!.receiptNumber, amount, checkNumber, descrip);
    return (client) ? this.dataStorage.acctPayment(client, checkPayment, PaymentMethodEnum.CHECK) :
      this.dataStorage.paidByCheck(checkPayment);

  }

  acctPaymentTransfer(client: string, amount: any, descrip: any) {
    const transferPayment = new TransferPayment(amount, descrip);
    return this.dataStorage.acctPayment(client, transferPayment, PaymentMethodEnum.TRANSFER);
  }

  printAcctBalance(client: string): Observable<any> {
    return this.dataStorage.printAcctBalance(client);
  }

  paidByGift(amount: number, card: string): Observable<Invoice> {
    const giftCardPayment = new GiftCardPayment(amount, card);
    return this.dataStorage.paidByGift(this.receiptNumber, giftCardPayment);
  }

  paidByTransfer(amount: number, descrip: string): Observable<Invoice> {
    const transferPayment = new TransferPayment(amount, descrip, this.receiptNumber);
    return this.dataStorage.paidByTransfer(transferPayment);
  }

  allowAddProductByStatus() {
    const allowStatus = [InvoiceStatus.IN_PROGRESS, InvoiceStatus.CREATED, InvoiceStatus.IN_HOLD];
    return (allowStatus.includes(this.invoice!.status)) ? true : false;
  }

  pickUp(callback?: () => void) {
    const title = 'Pick up';
    // if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
    this.cashService.getField(title, 'Client Name', EFieldType.NAME).subscribe((name) => {
      console.log('pick up modal', name);
      if (name.text) {
        this.cashService.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
          if (phone.number) {
            this.cashService.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
              if (!descrip.text) {
                console.log('pick up no set description');
              }
              this.setPickUp(name.text, phone.number, descrip.text).subscribe(order => {
                console.log('pick up this order', order);
                this.order = order;
                this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT ? callback!() :
                  this.dialogService.openGenericInfo('Information', 'This order was set to "Pick up"');
              }, error1 => {
                console.error('pick upt', error1);
                this.dialogService.openGenericInfo('Error', 'Can\'t complete pick up operation');
              });
            });
          } else {
            this.dialogService.openGenericInfo('Error', 'Can\'t complete pick up operation because no set Client Phone');
          }
        });
      } else {
        this.dialogService.openGenericInfo('Error', 'Can\'t complete pick up operation because no set Client Name');
      }
    });
  }

  delivery(callback?: () => void) {
    const title = 'Delivery';
    this.cashService.getField(title, 'Client Name', EFieldType.NAME).subscribe(name => {
      if (name) {
        // order.type.client.name = name.text;
        this.cashService.getField(title, 'Client Address', EFieldType.ADDRESS).subscribe(address => {
          if (address) {
            // order.type.client.address = address.text;
            this.cashService.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
              if (phone) {
                // order.type.client.telephone = phone.text;
                this.cashService.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                  if (!descrip.text) {
                    console.log('delivery no set description');
                  }
                  this.setDelivery(name.text, address.text, phone.number, descrip.text).subscribe(order => {
                    console.log('delivery this order', order);
                    this.order = order;
                    this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT ? callback!() :
                      this.dialogService.openGenericInfo('Information', 'This order was set to "Delivery"');
                  }, err => {
                    console.error('delivery', err);
                    this.dialogService.openGenericInfo('Error', 'Can\'t complete delivery operation');
                  });
                });
              } else {
                this.dialogService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Phone');
              }
            });
          } else {
            this.dialogService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Address');
          }
        });
      } else {
        this.dialogService.openGenericInfo('Error', 'Can\'t complete delivery operation because no set Client Name');
      }
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete delivery operation');
    });
  }

  logoutOpResponse() {
    this.authService.token = this.authService.initialLogin = undefined;
    this.dialogService.dialog.closeAll();
    this.resetDigits();
    this.removeInvoice();
    this.cashService.resetEnableState();
    this.cashService.evResetStock.emit();
    this.router.navigateByUrl('/auth/');
  }

  editProductOrder(po: ProductOrder) {
    console.log('editProductOrder', po);
    this.dataStorage.editProductOrderByInvoice(this.invoice!.receiptNumber, po, EOperationType.Update)
      .subscribe(next => {
        console.log('editProductOrder-next', next);
        this.setInvoice(next);
      }, err => {
        this.showErr(err);
      });
  }

  removeTip(removeTip: EOperationType): Observable<Invoice> {
    return this.dataStorage.removeTip(this.invoice!.receiptNumber);
  }

  deleteProductFromInvoice(po: ProductOrder): void {
    this.dataStorage.deleteProductOrderByInvoice(this.invoice!.receiptNumber, po.id, this.invoice!.isRefund)
      .subscribe(next => {
        next.productOrders = next.productOrders.filter(p => p.id !== po.id);
        console.log('delPOFromInvoice-next', next);
        this.setInvoice(next);
      }, err => {
        this.showErr(err);
      });

  }

  delProductsFromInvoive(po: ProductOrder[]) {
    const dialog = this.dialogService.openGenericInfo(InformationType.INFO,
      'Please wait while the products are removed');
    this.dataStorage.deleteProductOrdersByInvoice(this.invoice!.receiptNumber, po, this.invoice!.isRefund)
      .subscribe((next) => {
          console.log('delPOFromInvoice', next);

          if (this.invoice!.isRefund) this.deleteProdRefund = false;

          dialog!.close();
          if (next.status === InvoiceStatus.PAID) {
            this.warnInvoicePaid();
          } else {
            this.setInvoice(next);
            this.invoiceProductSelected.splice(0);
            this.setTotal();
          }
        },
        err => {
          console.error(err);
          dialog!.close();
          this.dialogService.openGenericInfo('Error', 'Can\'t complete remove products');
        });
    this.getUpdateInvoice();
  }

  getAllInvoiceByStatus(status?: InvoiceStatus): Observable<Invoice[]> {
    return this.dataStorage.getInvoiceByStatus(status!)
      .pipe(map(invoices => invoices))

  }

  getInvoiceDateRange(fromDate: Date | string, toDate: Date | string, pageNumber: number, pageSize: number): Observable<Invoice[]> {
    return this.dataStorage.getByDateRange(fromDate, toDate, pageNumber, pageSize)
  }

  addNoteInvoice(receiptNumber: string, noteInvoice: string) {
    return this.dataStorage.addNoteInvoice(receiptNumber, noteInvoice);
  }

  addPrepareNoteInvoice(receiptNumber: string, prepareNoteInvoice: string) {
    return this.dataStorage.addPrepareNoteInvoice(receiptNumber, prepareNoteInvoice);
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr!.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  /*
  setTableStatus( status : StatusTableEnum )
  {
    debugger;

    if (this.invoice && this.invoice?.order && this.invoice?.order?.type?.table != undefined )
    {
      this.tableService.setTableStatus( this.invoice?.order?.type?.table!, status);
    }
  }
  */

  groupByProductOrder(items: ProductOrder[]) {
    const value = this.groupBy(items, i => i.position);
    const look = Object.keys(value).sort(this.compareNumbers)
    console.log(look);
    return look.map((str) => {
      return parseInt(str)
    });
  }

  gotoRouter() {
    if (this.cashService.config!.sysConfig!.companyType! === CompanyType.RESTAURANT) {
      this.router.navigateByUrl("/home/layout/tables")
    } else {
      this.router.navigateByUrl("/home/layout/invoice/departaments")
    }

  }

  deleteInvoice(receiptNumber: string): Observable<Invoice> {
    return this.dataStorage.deleteInvoice(receiptNumber)
  }

  tipAuthorization(paymentMethod: any, paymentInvoice: PaymentInvoice) {
    return this.dataStorage.tipAuthorization(paymentMethod, paymentInvoice);
  }

  updateProductOrderByInvoice(po: ProductOrder[], receiptNumber: string): Observable<Invoice> {
    return this.dataStorage.updateProductOrderByInvoice(po, receiptNumber);
  }

  pendingInvoice(statusInvoice: InvoiceStatus[]): Observable<Invoice[]> {
    return this.dataStorage.pendingInvoice(statusInvoice);
  }

  private showErr(err: any, i?: Invoice) {
    console.error('addProductOrder', err);
    // this.delPOFromInvoice(po);
    this.resetDigits();
    (i && i.status === InvoiceStatus.CREATED) ? this.warnInvoicePaid() : this.dialogService.openGenericInfo('Error', err);
  }

  private compareNumbers(a: any, b: any) {
    return a - b;
  }

  aggregateCustomerInvoice(customerId: string): Observable<Invoice> {
    return this.dataStorage.aggregateCustomerInvoice(this.invoice?.receiptNumber!, customerId!)
  }


}
