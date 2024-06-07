import {EventEmitter, Injectable, Output} from '@angular/core';
import {InvoiceService} from './invoice.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../api/auth.service';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {EOperationType} from '../../utils/operation.type.enum';
import {CashService} from './cash.service';
import {FinancialOpEnum, InvioceOpEnum, PaymentOpEnum, StatusTable, TotalsOpEnum} from '../../utils/operations';
import {MatDialogRef} from '@angular/material/dialog';
import {CompanyType} from '../../utils/company-type.enum';
import {PaymentStatus} from '../../utils/payment-status.enum';
import {AdminOpEnum} from '../../utils/operations/admin-op.enum';
import {ETXType} from '../../utils/delivery.enum';
import {BehaviorSubject, Observable, of, Subject, Subscription} from 'rxjs';
import {dataValidation, operationsWithClear} from '../../utils/functions/functions';
import {OtherOpEnum} from '../../utils/operations/other.enum';
import {EFieldType} from '../../utils/field-type.enum';
import {EBTTypes} from '../../utils/card-payment-types.enum';
import {CustomerOpEnum} from '../../utils/operations/customer.enum';
import {ClientService} from './client.service';
import {InformationType} from '../../utils/information-type.enum';
import {PAXConnTypeEnum} from '../../utils/pax-conn-type.enum';
import {UserrolEnum} from '../../utils/userrol.enum';
import {PaymentMethodEnum} from '../../utils/operations/payment-method.enum';
import {InitViewService} from './init-view.service';
import {ScanOpEnum} from '../../utils/operations/scanner-op.enum';
import {debounceTime} from 'rxjs/operators';
import {Department} from 'src/app/models/department.model';
import {DialogService} from './dialog.service';
import {Product, ProductOrder, Token} from '@models/index';
import {DialogInvoiceComponent} from "@shared/components/dialog-invoice/dialog-invoice.component";
import {Invoice} from "@models/invoice.model";
import {Table} from "@models/table.model";
import {CashPaymentComponent} from "@shared/components/cash-payment/cash-payment.component";
import {ProductGenericComponent} from "@shared/components/product-generic/product-generic.component";
import {DialogDeliveryComponent} from "@shared/components/dialog-delivery/dialog-delivery.component";
import {PaidOutComponent} from "@shared/components/paid-out/paid-out.component";
import {DialogPaidoutComponent} from "@shared/containers/dialog-paidout/dialog-paidout.component";
import {DialogFilterComponent} from "@shared/containers/dialog-filter/dialog-filter.component";
import {InputCcComponent} from "@shared/components/input-cc/input-cc.component";
import {CashOpComponent} from "@shared/components/cash-op/cash-op.component";
import {SwipeCredentialCardComponent} from "@shared/components/swipe-credential-card/swipe-credential-card.component";
import {Order} from "@models/order.model";
import {OrderInfoComponent} from "@shared/components/order-info/order-info.component";
import {AssignTableComponent} from "@modules/home/component/assign-table/assign-table.component";
import {CalculatorTipComponent} from "@modules/home/component/calculator-tip/calculator-tip.component";
import {PaidInvoice} from "@models/paid-invoice.model";
import {CalculatorComponent} from "@modules/home/component/calculator/calculator.component";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {EApplyDiscount} from "@core/utils/apply-discount.enum";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {DlgPayMethodComponent} from "@modules/home/component/dlg-pay-method/dlg-pay-method.component";
import {Customer} from "@models/customer.model";
import {createServerCodeBundleOptions} from "@angular-devkit/build-angular/src/tools/esbuild/application-code-bundle";

@Injectable({
  providedIn: 'root'
})
export class OperationsService {


  inactivityTime = 60;
  timer: any;
  currentOperation?: string;
  invTotalsBeforeFSSubTotal = {total: 0, tax: 0, subtotal: 0};
  @Output() evCancelCheck = new EventEmitter<any>();
  @Output() evRemoveHold = new EventEmitter<any>();
  @Output() evCleanAdminOperation = new EventEmitter<any>();
  @Output() evAddProdGen = new EventEmitter<Product>();
  @Output() evBackUserOperation = new EventEmitter<boolean>(false);

  paidInvoice?: PaidInvoice;

  private bsPaidDocument$ = new Subject<PaidInvoice>();
  private notificationInvoicePending$: Subject<boolean> = new BehaviorSubject(false);

  constructor(private invoiceService: InvoiceService, public cashService: CashService,
              private authService: AuthService, private clientService: ClientService,
              private tableService: TablesService,
              private initService: InitViewService, private router: Router,
              private dialogService: DialogService,
              private dataStorage: DataStorageService,
              private departProductService: DepartProductService,
              private route: ActivatedRoute, private utils: DialogService) {

    this.invoiceService.evAddProd.subscribe(() => this.onAddProduct());
    this.invoiceService.evCreateInvoice.subscribe(next => this.createdInvoice(next));
    this.invoiceService.evUpdateProds.subscribe(ev => this.resetInactivity(true));
    this.invoiceService.evTableLayot.subscribe(next => this.goTableLayout(next));
    this.cashService.evLogout.subscribe(ev => this.logout(ev));
    this.cashService.evResetEnableState.subscribe(ev => this.resetCurrentOperation());
    this.counterInactivity();
  }

  public paidDocumentObservable(): Observable<PaidInvoice> {
    return this.bsPaidDocument$.asObservable();
  }

  public subscribeNotificationInvoicePending(): Observable<boolean> {
    return this.notificationInvoicePending$.asObservable();
  }

  public sendNotificationInvoicePending(value: boolean) {
    this.notificationInvoicePending$.next(value)
  }

  createdInvoice(next: boolean) {
    if (this.invoiceService.authService.token) {
      next ? this.navigateToDept() : this.logoutOp();
    }
  }

  navigateToDept() {
    this.resetInactivity(true);
    if (this.router.url.includes('products')) {
      //this.router.navigateByUrl('/home/layout/invoice/departaments', { replaceUrl: true });
    }
  }

  counterInactivity() {
    this.timer = setTimeout(() => {
      if (this.letLogout(this.invoiceService.invoice?.status!) && this.currentOperation !== AdminOpEnum.CLOSE_BATCH) {
        console.log('counterInactivity if');
        this.logout(true);
      } else {
        console.log('counterInactivity else');
        this.resetInactivity(true);
      }
    }, this.getInactivityTime() * 60000);
  }

  getInactivityTime(): number {
    return (this.cashService.config.sysConfig!) ? this.cashService.config!.sysConfig!.inactivityTime! : 120;
  }

  resetInactivity(cont: boolean, msg?: string) {
    console.log('resetInactivity', cont, msg);
    clearTimeout(this.timer);
    if (cont) {
      this.counterInactivity();
    }
    this.invoiceService.getUpdateInvoice();
  }

  clear() {
    console.log('clear');
    if (this.invoiceService.invoiceProductSelected.length <= 0 ||
      operationsWithClear.filter(i => i === this.currentOperation).length > 0) {
      this.clearOp(false);
    } else {
      this.clearOp();
    }
    this.resetInactivity(true);
  }

  clearOp(total: boolean = true) {
    if (operationsWithClear.filter(i => i === this.currentOperation).length > 0) {
      this.invoiceService.isReviewed = false;
      this.invoiceService.isRecalled = false;
      if (this.currentOperation === FinancialOpEnum.REVIEW ||
        this.currentOperation === FinancialOpEnum.REPRINT ||
        this.currentOperation === AdminOpEnum.CANCEL_CHECK ||
        this.currentOperation === AdminOpEnum.REMOVE_HOLD) {
        this.invoiceService.createInvoice();
        if (this.currentOperation === AdminOpEnum.CANCEL_CHECK) {
          this.evCancelCheck.emit(false);
        }
        if (this.currentOperation === AdminOpEnum.REMOVE_HOLD) {
          this.evRemoveHold.emit(false);
        }
      }
      if (this.currentOperation === TotalsOpEnum.FS_SUBTOTAL) {
        this.resetTotalFromFS();
        this.resetSubTotalState();
      }
      if (this.currentOperation === TotalsOpEnum.SUBTOTAL) {
        console.log('Clear of Subtotal');
        this.resetSubTotalState();
      }
      this.currentOperation = '';
      this.cashService.resetEnableState();
    } else if (this.invoiceService.invoiceProductSelected.length <= 0 && !this.invoiceService.digits &&
      this.currentOperation === FinancialOpEnum.RECALL) {
      this.invoiceService.createInvoice();
    } else if (this.invoiceService.invoiceProductSelected.length > 0 || this.invoiceService.digits) {
      if (this.invoiceService.invoiceProductSelected.length > 0) {

        this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, 'Confirm', 'Do you want clear?',
          null, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
          if (next !== undefined && next.confirm) {
            if (this.cashService.config.sysConfig.allowLastProdClear === undefined) {
              this.cashService.config.sysConfig.allowLastProdClear = false;
            }
            if (this.cashService.config.sysConfig.allowClear) {
              this.deleteSelectedProducts();
            } else if (this.cashService.config.sysConfig.allowLastProdClear && this.invoiceService.lastProdAdd) {
              this.deleteLastProduct();
            } else {
              this.delSelProdByAdmin();
            }
          }
        });
      } else {
        this.invoiceService.evDelProd.emit(true);
      }

    }
    this.evCleanAdminOperation.emit();
  }

  resetSubTotalState() {
    console.log('Call clear API for update invoice');
    this.invoiceService.clear().subscribe(
      next => this.invoiceService.setInvoice(next),
      error1 => this.dialogService.openGenericInfo(InformationType.ERROR, error1)
    );
  }

  delSelProdByAdmin() {
    console.log('Delete products by admin');
    this.authService.adminLogged() ? this.deleteSelectedProducts() : this.manager('clear');
  }

  deleteSelectedProducts(token?: any) {
    console.log('deleteSelected', token);
    this.invoiceService.evDelProd.emit(token);
  }

  void() {
    console.log('void', this.invoiceService.invoice!.productOrders);
    if ((this.invoiceService.invoice?.status! === InvoiceStatus.IN_PROGRESS &&
        this.invoiceService.invoice!.productOrders!.length > 0) ||
      this.invoiceService.invoice?.status! === InvoiceStatus.IN_HOLD ||
      this.invoiceService.invoice?.status! === InvoiceStatus.PENDENT_FOR_AUTHORIZATION ||
      this.invoiceService.invoice?.status! === InvoiceStatus.PENDENT_FOR_PAYMENT ||
      this.invoiceService.invoice?.isRefund!) {

      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, 'Confirm', 'Do you want void?', null,
        DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
        if (next !== undefined && next.confirm) {
          debugger;
          this.currentOperation = 'void';
          //this.cancelCheck();
          this.authService.adminLogged() ? this.cancelCheck() : this.manager('void');
        }
      });
    } else {
      this.dialogService.openGenericAlert(DialogType.DT_WARNING, 'Warning', 'Void operation is only for invoice with' +
        ' products, in hold or in progress', undefined, DialogConfirm.BTN_CLOSE);
    }
    this.resetInactivity(true);
  }

  plu() {
    console.log('plu');
    this.currentOperation = InvioceOpEnum.PLU;
    this.addProduct(EOperationType.Plu);
  }

  addProduct(op: EOperationType) {
    // If is a weight format product
    const origUPC = this.invoiceService.numbers;
    const isWFormat = this.isWeightFormatProduct();
    if (isWFormat) {
      this.getPriceAndUPCOfWFP();
    }
    // Consume servicio addProduct con this.digits esto devuelve ProductOrder
    this.invoiceService.addProductByUpc(EOperationType.Plu)
      .pipe(debounceTime(this.cashService.config.sysConfig.debounceTime! * 100))
      .subscribe(prods => {
        this.selectProd(prods).subscribe(prod => {
          console.log(EOperationType[op], prod, this.invoiceService.qty);
          this.initService.setOperation(op, 'Product', 'Get product id: ' + prod.id);
          if (prod) {
            this.initService.setOperation(op, 'Product', 'Emit add product id: ' + prod.id);
            this.invoiceService.evAddProdByUPC.emit(prod);
          } else {
            this.invoiceService.resetDigits();
          }
        });
      }, err => {
        console.error('addProductByUpc', err);
        if (isWFormat) {
          this.invoiceService.numbers = origUPC;
          this.invoiceService.addProductByUpc(op).subscribe(prods => {
            this.selectProd(prods).subscribe(prod => {
              console.log(EOperationType[op], prod, this.invoiceService.qty);
              this.initService.setOperation(op, 'Product', 'Get product id: ' + prod.id);
              prod ? this.invoiceService.evAddProdByUPC.emit(prod) : this.invoiceService.resetDigits();
            });
          }, err => {
            console.error('addProductByUpc', err);
            this.invoiceService.resetDigits();
            this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t complete get product by plu', undefined, DialogConfirm.BTN_CLOSE);
          });
        } else {
          this.invoiceService.resetDigits();

          this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t complete get product by plu', undefined, DialogConfirm.BTN_CLOSE);
        }
      });
    this.resetInactivity(false);
  }

  selectProd(prods: Product[]): Observable<Product> {
    let $prod: Observable<Product>;
    if (prods.length > 1) {
      $prod = this.dialogService.dialog.open(DialogInvoiceComponent,
        {
          width: '780px', height: '660px',
          data: {
            invoice: prods,
            label: 'name',
            detail: 'unitCost',
            title: 'Products',
            subtitle: 'Select a product',
            filter: false
          },
          disableClose: true
        }).afterClosed();
    } else {
      $prod = of(prods[0]);
    }
    return $prod;
  }

  priceCheck() {
    console.log('priceCheck');
    (this.currentOperation !== InvioceOpEnum.PRICE) ? this.currentOperation = InvioceOpEnum.PRICE : this.currentOperation = '';
    if (this.invoiceService.digits) {
      this.invoiceService.getProductByUpc(EOperationType.PriceCheck).subscribe(prods => {
        this.selectProd(prods).subscribe(prod => {
          if (prod) {
            this.dialogService.openGenericInfo('Price check', 'Do you want add ' + prod.name + ' to the invoice',
              prod.unitCost, true)!
              .afterClosed().subscribe((next: any) => {
              console.log(next);
              if (next !== undefined && next.confirm) {
                // Logout
                this.invoiceService.evAddProdByUPC.emit(prod);
              }
            });
          } else {
            this.invoiceService.resetDigits();
          }
        });
      }, err => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
          'Can\'t found this product ' +
          this.invoiceService.digits, undefined, DialogConfirm.BTN_CLOSE);
      });
      this.invoiceService.resetDigits();
    }
    this.resetInactivity(true);
  }

  numpadInput(ev: any) {
    this.invoiceService.evNumpadInput.emit(ev);
  }

  actionByManager(action: string, token: any, data?: any) {
    switch (action) {
      case 'void':
        this.cancelCheckByAdmin(token);
        break;
      case 'clear':
        this.clearCheckByAdmin(token);
        break;
      case 'refund':
        this.refundCheckByAdmin(token);
        break;
      case 'prodGen':
        this.prodGenCheckByAdmin(token, data);
        break;
      case 'cancelRefund':
        this.cancelRefundOp(token, data);
        break;
    }
  }

  manager(action?: string, data?: any) {
    console.log('manager', action, data);
    this.authService.storeInitialLogin();
    if (this.authService.adminLogged()) {
      if (action) {
        this.actionByManager(action, this.authService.token, data);
      } else {
        if (this.authService.token!.rol === UserrolEnum.ADMIN) {
          this.router.navigateByUrl('/cash/options', {replaceUrl: true});
        } else {
          this.adminLogin().subscribe((res: any) => this.adminLoginOp(res));
        }
      }
    } else {
      this.adminLogin().subscribe((loginValid: any) => this.adminLoginOp(loginValid, action, data));
    }
    this.resetInactivity(true);
  }

  adminLogin() {
    return this.dialogService.dialog.open(CalculatorComponent, {
      width: '511px', height: '670px',
      data: {amountPaid: 0, titleCalculator: "Supervisor password", password: true, maxlength: 4},
      disableClose: true
    }).afterClosed()
    /*
    return this.dialogService.dialog.open(DialogLoginComponent, { width: '530px', height: '580px',
      disableClose: true, autoFocus: false})
      .afterClosed();
     */
  }

  adminLoginOp(response: any, action?: any, data?: any) {
    console.log('The dialog was closed', response);
    if (response.valid) {
      if (action) {
        this.actionByManager(action, response.token, data);
      } else {
        this.invoiceService.getCashier();
        this.router.navigateByUrl('/cash/options', {replaceUrl: true});
      }
    }
  }

  hold() {
    console.log('hold');
    this.currentOperation = 'hold';
    if (this.invoiceService.invoice!.productOrders.length > 0) {
      if (this.cashService.config.sysConfig.companyType === CompanyType.BAR) {
        this.getHoldOrderUser();
      } else {
        this.holdOp();
      }
    } else {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Not possible Hold Order without products in' +
        ' this Invoice', undefined, DialogConfirm.BTN_CLOSE)
    }
    this.resetInactivity(true);
  }

  getHoldOrderUser() {
    if (this.cashService.config.sysConfig.companyType === CompanyType.BAR) {
      this.getField(EOperationType[EOperationType.HoldOlder], 'Client Name', EFieldType.NAME).subscribe((name) => {
        console.log('pick up modal', name);
        if (name.text) {
          this.holdOp(name.text);
        }
      });
    }
  }

  inProgressOp(user?: string, action?: () => void) {
    this.invoiceService.InProgressOrder(user).subscribe(
      next => {
        /*
        (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) ?
          this.holdOpPost() : this.invoiceService.createInvoice();
        */
        if (action) action();
      },
      err => this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t complete hold order' +
        ' operation', undefined, DialogConfirm.BTN_CLOSE));
  }

  holdOp(user?: string, action?: () => void) {
    this.invoiceService.holdOrder(user).subscribe(
      next => {
        (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) ?
          this.holdOpPost() : this.invoiceService.createInvoice();
        if (action) action();
      },
      err => this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t complete hold order' +
        ' operation', undefined, DialogConfirm.BTN_CLOSE));
  }

  holdOpPost() {
    console.log('holdOpPost');
    //this.invoiceService.resetDigits();
    this.invoiceService.removeInvoice();
    this.invoiceService.evTableLayot.next(false);
  }

  recallCheck() {
    console.log('recallCheck');
    this.currentOperation = FinancialOpEnum.RECALL;
    this.invoiceService.isRecalled = true;
    this.resetInactivity(true);
    if (this.invoiceService.invoice!.status !== InvoiceStatus.IN_PROGRESS) {
      this.invoiceService.digits ?
        this.invoiceService.recallCheck().subscribe(i => {
          i.status === InvoiceStatus.IN_HOLD ? this.invoiceService.setInvoice(i) :
            this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
              'Can\'t complete recall check operation because invoice is not in hold', undefined, DialogConfirm.BTN_CLOSE)

        })
        :
        this.invoiceService.getInvoiceByStatus(EOperationType.RecallCheck, InvoiceStatus.IN_HOLD)
          .subscribe(next => this.utils.openDialogInvoices(next, i => {
              this.getCheckById(EOperationType.RecallCheck, j => {
                this.invoiceService.setInvoice(j);
              }, i.receiptNumber);
            }),
            err =>
              this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
                'Can\'t complete recall check operation', undefined, DialogConfirm.BTN_CLOSE));
    } else {
      console.error('Can\'t complete recall check operation');
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
        'Can\'t complete recall check operation because check is in progress', undefined, DialogConfirm.BTN_CLOSE);
    }
  }

  reviewCheck(action?: (invoice: Invoice) => void) {
    console.log('reviewCheck');
    this.currentOperation = FinancialOpEnum.REVIEW;
    this.invoiceService.isReviewed = true;
    this.resetInactivity(true);

    if (this.invoiceService.digits) {
      this.getCheckById(EOperationType.ReviewCheck, i => {
        console.log("Invoice ", i);
        this.invoiceService.setInvoice(i);

        if (i!.order && i!.order!.table!) {
          this.tableService.setTableSelected(i!.order!.table!)
        }
        this.cashService.reviewEnableState();
        if (action) action(i);
      });
    } else {
      this.keyboard(FinancialOpEnum.REVIEW);
    }
  }

  subTotal() {
    console.log('subTotal', this.currentOperation);
    const refund = this.currentOperation === FinancialOpEnum.REFUND;
    if (this.invoiceService.invoice!.productOrders.length > 0 || (this.cashService.config.sysConfig.fullRefund && refund)) {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
      const refundOrRefunSale = this.invoiceService.invoice?.isRefund! || this.invoiceService.invoice?.isRefundSale!;
      this.cashService.totalsDisabled(refundOrRefunSale, this.cashService.config.sysConfig.allowEBT);
      this.cashService.setOperation(EOperationType.Subtotal, 'Invoice', 'Before operation Subtotal by ' +
        this.cashService.authServ.token!.user_id);
      const paymentStatus = this.invoiceService.invoice?.paymentStatus!;
      if (this.invoiceService.invoice?.status! === InvoiceStatus.PENDENT_FOR_AUTHORIZATION) {
        //this.router.navigateByUrl('/cash/payment', { replaceUrl: true });
        this.cashService.resetEnableState();
      } else {
        this.invoiceService.subTotal().subscribe(
          (next: Invoice) => {

            if (next.isPromotion && !(next.isRefund || next.isRefundSale)) {
              next.totalPromo = this.invoiceService.invoice?.total! - next.total;
            }
            if (paymentStatus === PaymentStatus.AUTH) {
              next.paymentStatus = paymentStatus;
            }
            this.invoiceService.setInvoice(next);
            if (this.invoiceService.invoice?.status! === InvoiceStatus.PAID &&
              this.invoiceService.invoice?.paymentStatus! !== PaymentStatus.AUTH) {
              this.invoiceService.warnInvoicePaid();
            } else {
              (this.invoiceService.invoice!.productOrders.length > 0) ?
                this.cashService.totalsEnableState(false, refund || (next.isRefund || next.isRefundSale)) :
                this.cashService.resetEnableState();
            }
            //this.router.navigateByUrl('/cash/payment', { replaceUrl: true });
          },
          err => {
            this.dialogService.openGenericInfo(InformationType.ERROR, err);
            this.cashService.resetEnableState();
          }
        );
      }
    }
  }

  ebtSubTotal() {
    console.log('ebtSubTotal', this.currentOperation);
    const refund = this.currentOperation === FinancialOpEnum.REFUND;
    if (this.invoiceService.invoice!.productOrders.length > 0 || (this.cashService.config.sysConfig.fullRefund && refund)) {
      this.currentOperation = TotalsOpEnum.FS_SUBTOTAL;
      this.cashService.totalsDisabled();
      this.invoiceService.fsSubTotal().subscribe(
        next => {
          // Calculate total discount by promotion
          if (next.isPromotion && !next.isRefund) {
            next.totalPromo = this.invoiceService.invoice!.total - next.total;
          }
          this.invoiceService.setInvoice(next);
          if (this.invoiceService.invoice?.status! === InvoiceStatus.PAID) {
            this.invoiceService.warnInvoicePaid();
          } else {
            this.invoiceService.invoice!.productOrders.length > 0 ?
              this.cashService.totalsEnableState(this.invoiceService.invoice!.fsTotal! > 0, refund || (next.isRefund || next.isRefundSale)) :
              this.cashService.resetEnableState();
          }
          //this.router.navigateByUrl('/cash/payment', { replaceUrl: true });
        },
        err => {
          this.dialogService.openGenericInfo(InformationType.ERROR, err);
          this.cashService.resetEnableState();
        }
      );
    }
  }

  fsSubTotal() {
    console.log('fsSubTotal');
    if (this.invoiceService.invoice!.productOrders.length > 0) {
      this.currentOperation = TotalsOpEnum.FS_SUBTOTAL;
      this.saveStateTotals();
      this.invoiceService.invoice!.productOrders.filter(po => {
        if (po.foodStamp) {
          this.invoiceService.invoice!.fsTotal = this.invoiceService.invoice!.fsTotal ?
            this.invoiceService.invoice!.fsTotal + po.subTotal : po.subTotal;
          // this.invoiceService.invoice.total -= po.total;
          this.invoiceService.evUpdateTotals.emit();
        }
        console.log('fsTotal', this.invoiceService.invoice!.fsTotal);
        if (!this.invoiceService.invoice!.fsTotal) {
          this.cashService.totalsEnableState();
        } else {
          this.cashService.totalsEnableState(true);
        }
      });
    }
    this.resetInactivity(true);
  }

  getCheckById(typeOp: EOperationType, action: (i: Invoice) => void, id?: string) {
    const dialog = this.dialogService
      .openGenericAlert(DialogType.DT_INFORMATION, "Information", 'Getting invoice...', undefined, DialogConfirm.BTN_NONE);

    this.invoiceService.getInvoicesById(typeOp, id)
      .subscribe(
        next => {
          dialog!.close();
          action(next);
        },
        err => {
          dialog!.close();
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, err, undefined, DialogConfirm.BTN_CLOSE)
          this.invoiceService.resetDigits();
          this.cleanCurrentOp();
        }
      );
  }

  openDialogInvoices(inv: Invoice[], action: (i: any) => void, noSelectionMsg?: string, title?: string, subTitle?: string) {
    this.openDialogWithPag(inv, action, title!, subTitle!, 'receiptNumber', 'total', 'orderInfo');
  }

  openDialogTables(tabs?: Table[]) {
    (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) ?
      this.goTableLayout(true) : this.showTables();
  }

  goTableLayout(hold?: boolean) {
    this.invoiceService.restaurantTableId = '';
    this.invoiceService.txType = ETXType.DINEIN;
    (hold && this.invoiceService.invoice!.status !== InvoiceStatus.CREATED) ?
      this.invoiceService.holdOrder().subscribe(next => this.navigateToRestaurant(),
        err => this.utils.openGenericInfo(InformationType.ERROR, err)) :
      this.navigateToRestaurant();
  }

  navigateToRestaurant() {
    this.invoiceService.evDelAllProds.emit();
    //this.router.navigateByUrl('/home/layout/invoice');
  }

  showTables() {
    this.invoiceService.tables().subscribe(tables => {
      this.utils.openDialogWithPag(tables, t => this.setDineIn(t), 'Tables', 'Select a table', undefined, 'label');
    }, err => {
      console.error('Error getting tables', err);
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
        'Can\'t complete get tables operation', undefined, DialogConfirm.BTN_CLOSE);
    });

  }

  setDineIn(table: Table) {
    console.log(table);
    if (table) {
      this.invoiceService.setDineIn(<Table>table).subscribe((next: Order) => {
        if (next) {
          console.log('setDineIn order', next);
          this.invoiceService.order = next;
          this.invoiceService.setOrderEmit(next);
        } else {
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
            'Can\'t complete dine in operation', undefined, DialogConfirm.BTN_CLOSE);
        }
      }, err => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error',
          'Can\'t complete dine in operation', undefined, DialogConfirm.BTN_CLOSE);
      });
    }
  }

  openDialogWithPag(dataArr: Array<any>, action: (i: any) => void, title: string, subTitle: string, label: string,
                    detail?: string, subdetail?: string, noSelectionMsg?: string,
                    lengthLabel?: number) {
    if (dataArr.length > 0) {
      const dialogRef = this.dialogService.dialog.open(DialogInvoiceComponent,
        {
          width: '780px', height: '680px',
          data: {
            invoice: dataArr,
            title: title,
            subtitle: subTitle,
            label: label,
            detail: detail,
            subdetail: subdetail
          },
          disableClose: true
        });
      dialogRef.afterClosed().subscribe((order: any) => {
        console.log('The dialog with pagination was closed', order);
        if (order) {
          action(order);
        } else {
          if (noSelectionMsg) {
            this.dialogService.openGenericAlert(DialogType.DT_WARNING, undefined,
              noSelectionMsg, undefined, DialogConfirm.BTN_CLOSE);
          }
          // this.cashService.resetEnableState();
        }
      });
    } else {
      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, 'Information', 'There aren\'t elements to select',
        undefined, DialogConfirm.BTN_CLOSE);
      this.cashService.resetEnableState();
    }
  }

  openDialogWithPagObs(dataArr: Array<any>, title: string, subTitle: string, label: string,
                       detail?: string, subdetail?: string, noSelectionMsg?: string): Observable<any> {
    return this.dialogService.dialog.open(DialogInvoiceComponent,
      {
        width: '780px', height: '680px',
        data: {invoice: dataArr, title: title, subtitle: subTitle, label: label, detail: detail, subdetail: subdetail},
        disableClose: true
      }).afterClosed();
  }

  refund(digits?: string) {
    console.log('refund');
    this.currentOperation = FinancialOpEnum.REFUND;
    if (digits) this.invoiceService.digits = digits!;

    this.authService.adminLogged() ? this.refundOp() : this.manager('refund');
    //this.keyboard(FinancialOpEnum.REFUND);
    /*
    } else {
      console.error('Can\'t complete refund operation');
      this.invoiceService.resetDigits();
      this.dialogService.openGenericInfo('Error', 'Can\'t complete refund operation because check is in progress');
    } else {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete refund operation because check is in progress');
    }
    */
  }

  refundOp() {
    this.invoiceService.refund().subscribe((i: Invoice) => {
        if (i!.isRefund)
          this.invoiceService.deleteProdRefund = true;

        if (i!.productOrders.length === 0) {
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', "Refund complety",
            undefined, DialogConfirm.BTN_CLOSE);
        } else {
          console.log('refund', i);
          i!.status = InvoiceStatus.IN_PROGRESS;
          this.invoiceService.setInvoice(i);
          this.authService.restoreInitialLogin();
          this.router.navigateByUrl('/home/layout/invoice/departaments', {replaceUrl: true});
        }
      },
      err => {
        this.authService.restoreInitialLogin();
        console.error(err);
        this.invoiceService.resetDigits();
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', err,
          undefined, DialogConfirm.BTN_CLOSE);
      }
    );
  }

  letLogout(status: InvoiceStatus) {
    const noLogoutStates =
      [InvoiceStatus.IN_PROGRESS, InvoiceStatus.PENDENT_FOR_PAYMENT, InvoiceStatus.CREATED];
    return !noLogoutStates.includes(status);
  }

  logout(direct?: boolean) {
    console.log('logout');
    this.currentOperation = 'logout';
    /*
    if (!this.invoiceService.isCreating && this.invoiceService.invoice !== undefined /*&&
      !this.letLogout(this.invoiceService.invoice?.status!)) {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete logout operation because check is in progress');
    } else {
    */
    this.invoiceService.isCreating = false;
    direct ? this.logoutOp() :
      this.dialogService
        .openGenericAlert(DialogType.DT_INFORMATION, "Confirmation", 'Do you want logout?',
          undefined, DialogConfirm.BTN_CONFIRM)!
        //openGenericInfo('Confirm', 'Do you want logout?', null, true)
        .afterClosed().subscribe((next: any) => {
        console.log(next);
        if (next) {
          this.logoutOp();
        }
      });
    /*
    }
      this.resetInactivity(false);
     */
  }

  logoutOp() {
    this.authService.logout().subscribe(value => {
      console.log('logoutOp', value);
      this.logoutOpResponse();
    }, error1 => {
      console.error('LogoutOp', error1);
      //(error1.includes('Timeout trying connect with server')) ? this.logoutOpResponse() :
      //  this.dialogService.openGenericInfo(InformationType.ERROR, error1);
      this.logoutOpResponse();
    });
  }

  logoutOpResponse() {
    this.authService.token = this.authService.initialLogin = undefined;
    this.dialogService.dialog.closeAll();
    this.invoiceService.resetDigits();
    this.invoiceService.removeInvoice();
    this.cashService.resetEnableState();
    this.cashService.evResetStock.emit();
    this.router.navigateByUrl('/auth/users/loginuser', {replaceUrl: true});
    this.resetInactivity(false);
  }

  cancelCheck() {
    console.log('cancelar factura');
    const dialog = this.dialogService
      .openGenericAlert(DialogType.DT_INFORMATION, 'Process', 'Voiding transaction',
        undefined, DialogConfirm.BTN_NONE);

    this.invoiceService.cancelInvoice().subscribe(next => {
      dialog!.close();
      this.tableService.setTableStatus(StatusTable.AVAILABLE);
      this.invoiceService.removeInvoice();
      this.notificationInvoicePending$.next(true);
    }, err => {
      console.error('cancelCheck failed');
      dialog!.close();
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t complete void operation',
        undefined, DialogConfirm.BTN_CLOSE);
    });
    this.resetInactivity(true);
  }

  opByAdminLogout(t: Token, callback?: () => void) {
    this.authService.logout().subscribe(
      next => {
        this.authService.token = t;
        callback!();
      },
      error => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error, undefined, DialogConfirm.BTN_CLOSE)!
          .afterClosed().subscribe((next: any) => this.logoutOp()
        );
      }
    );
  }

  cancelCheckByAdmin(t?: Token) {
    console.log('cancelCheckByAdmin', t);
    const dialog = this.dialogService.openGenericInfo(InformationType.INFO, 'Voiding transaction');
    this.invoiceService.cancelInvoice(t ? this.invoiceService.cashier : undefined).subscribe(next => {
      console.log('cancelChekByAdmin', next);
      dialog!.close();
      // this.opByAdminLogout(t, () => this.afterCancel());
      this.tableService.setTableStatus(StatusTable.AVAILABLE);
      this.authService.restoreInitialLogin();
      this.invoiceService.removeInvoice();
    }, err => {
      console.error('cancelCheck failed');
      this.authService.restoreInitialLogin();
      dialog!.close();
      if (t) {
        this.authService.token = t;
      }
      this.dialogService.openGenericInfo('Error', 'Can\'t complete void operation');
    });
    this.resetInactivity(true);
  }

  afterCancel() {
    this.cashService.setOperation(EOperationType.CreateInvoice, 'Invoice',
      'Before create invoice after void by ' + this.cashService.authServ.token!.user_id);
    this.invoiceService.createInvoice();
  }

  clearCheckByAdmin(t?: Token) {
    console.log('clearCheckByAdmin', t);
    this.deleteSelectedProducts(t);
    // this.authService.token = t;
    this.resetInactivity(true);
  }

  refundCheckByAdmin(t?: Token) {
    console.log('refundCheckByAdmin', t);
    this.refundOp();
    this.authService.token = t;
    this.resetInactivity(true);
  }

  prodGenCheckByAdmin(t?: Token, data?: Product) {
    console.log('prodGenCheckByAdmin', t, data);
    this.evAddProdGen.emit(<Product>data);
    this.authService.token = t;
    this.resetInactivity(true);
  }

  openInfoEventDialog(paymentMethod: PaymentMethodEnum): MatDialogRef<any, any> {

    const infoEventDialog =
      this.dialogService.openDialog(DlgPayMethodComponent, "", "432px", "386px", false,
        {paymentMethod});

    //const infoEventDialog =
    //  this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Information", title, undefined, DialogConfirm.BTN_NONE)

    infoEventDialog!.afterClosed().subscribe(() => this.cashService.resetEnableState());
    return infoEventDialog!;
  }

  getTotalToPaid(opType?: PaymentOpEnum) {
    debugger;

    console.log('getTotalToPaid', opType, this.invoiceService.invoice);
    const total = this.invoiceService.invoice!.total;
    const balance = this.invoiceService.invoice!.balance;
    const tax = this.invoiceService.invoice!.tax;
    const config = this.cashService.config.sysConfig;
    //const tip = (config.allowTip  && this.invoiceService.invoice!.tip) ?
    //  this.invoiceService.invoice!.tip! : 0;
    const total2Paid = Number(balance !== undefined ? balance : total) /*+ Number(tip!)*/;
    return (config.removeTax && opType === PaymentOpEnum.CASH) ? (total2Paid - tax!) : total2Paid;
  }

  cash(opType?: PaymentOpEnum) {
    console.log('cash');
    const totalToPaid = this.getTotalToPaid(opType);
    if ((totalToPaid != 0 || (totalToPaid == 0 && this.cashService.config.sysConfig.fullRefund))
      && (this.invoiceService.invoice!.isRefund || this.invoiceService.invoice!.isRefundSale)) {
      console.log('paid refund, open cash!!!');
      this.invoiceService.cash(totalToPaid, totalToPaid, opType)
        .subscribe(
          data => {
            console.log(data);
            this.paymentReturn(totalToPaid).subscribe((result: any) => {
              if (result.closeAutomatic) this.logoutOp();
              //this.invoiceService.createInvoice();
            });
          },
          err => this.dialogService.openGenericInfo('Error', err),
          () => this.cashService.resetEnableState());
    } else if (totalToPaid > 0 || this.payZeroByDiscount(totalToPaid)) {
      this.invoiceService.digits ?
        this.totalFromDigits(this.invoiceService.digits, totalToPaid, PaymentOpEnum.CASH) : this.totalFromField(totalToPaid, PaymentOpEnum.CASH);
    }
    this.currentOperation = opType;
    this.resetInactivity(true);
  }

  totalFromDigits(paid: any, total: any, op?: PaymentOpEnum) {
    const cost = +(parseFloat(paid) * 0.01).toFixed(2);
    this.cashPaid(cost, total, op);
  }

  totalFromField(total: any, op?: PaymentOpEnum) {
    this.getTotalField(total).subscribe((data: any) => {
      this.cashPaid(data, total, op);
    });
  }

  cashMoney(paid: any, tips?: number) {
    this.currentOperation = PaymentOpEnum.CASH;
    this.cashPaid(paid, Math.abs(this.getTotalToPaid(PaymentOpEnum.CASH)), PaymentOpEnum.CASH, tips!);
  }

  cashPaid(paid: any, totalToPaid?: number, op?: PaymentOpEnum, tips?: number) {
    this.invoiceService.resetDigits();
    const total2Paid = (totalToPaid) ? totalToPaid : this.getTotalToPaid(op);
    if (paid > 0 || this.payZeroByDiscount(paid)) {
      const valueToReturn = parseFloat((paid - total2Paid).toFixed(2));
      /*
      if (valueToReturn < 0) {
        this.invoiceService.invoice!.balance = valueToReturn * -1;
      } else {
        this.invoiceService.invoice!.balance = 0.00;
      }
      */
      this.cashOp(valueToReturn, paid, total2Paid, tips!);
    } else {
      this.currentOperation = TotalsOpEnum.SUBTOTAL;
    }
  }

  cashOp(valueToReturn: number, payment: any, totalToPaid: number, tips?: number) {
    console.log('cash', this.currentOperation);

    const opMsg = 'cash payment';
    //const dialogInfoEvents = this.dialogService.openGenericInfo('Cash', 'Paying by cash...', undefined,
    //  undefined, true);

    const dialogInfoEvents =
      this.dialogService.openDialog(DlgPayMethodComponent, "", "432px", "386px", false,
        {
          paymentMethod: PaymentMethodEnum.CASH
        })

    const $cashing = this.invoiceService.cash(payment, totalToPaid, <PaymentOpEnum>this.currentOperation, tips!)
      .subscribe(data => {
          console.log(data);
          dialogInfoEvents!.close();
          clearTimeout(timeOut);

          if (valueToReturn > 0) {
            this.tableService.setTableStatus(StatusTable.BUSY);
            this.paymentReturn(valueToReturn).subscribe((result: any) => {
              if (result.closeAutomatic) {
                this.logoutOp();
              } else if (+valueToReturn >= 0 || data.status === InvoiceStatus.PAID) {
                this.tableService.setTableStatus(StatusTable.BUSY);
              } else {
                console.log('Invoice not is paid', data, valueToReturn);
              }
              this.bsPaidDocument$.next({invoice: data, payment: PaymentOpEnum.CASH, paidInvoice: payment});
              this.invoiceService.gotoRouter();
            });

          } else if (valueToReturn === 0 || data.status === InvoiceStatus.PAID) {
            this.tableService.setTableStatus(StatusTable.AVAILABLE);
            this.bsPaidDocument$.next({invoice: data, payment: PaymentOpEnum.CASH, paidInvoice: payment});
          } else {
            console.log('Invoice not is paid', data, valueToReturn);
            this.invoiceService.setInvoice(data);
          }
        },
        err => {
          console.error(err);
          this.dialogService.openGenericInfo('Error', err);
          dialogInfoEvents!.close();
          clearTimeout(timeOut);
        },
        () => {
          this.cashService.resetEnableState();
          clearTimeout(timeOut);
        });

    const timeOut = this.paxTimeOut($cashing, dialogInfoEvents!, opMsg);
  }

  paxTimeOut($op: Subscription, dialogInfoEvents: MatDialogRef<any, any>, opMsg: string): number {
    // @ts-ignore
    return setTimeout(() => {
      dialogInfoEvents.close();
      $op.unsubscribe();
      this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + opMsg + ' operation because timeout. ' +
        'Please press SUBTOTAL operation again.');
      this.cashService.resetEnableState();
    }, this.cashService.config.sysConfig!.paxTimeout! * 1000);
  }

  paymentReturn(valueToReturn: any, close?: boolean) {
    close = this.cashService.config.sysConfig.closeChange;
    return this.dialogService.dialog.open(CashPaymentComponent,
      {
        width: '350px',
        height: '260px',
        data: {value: valueToReturn, close: close, closeAutomatic: false},
        disableClose: true
      }).afterClosed();
  }

  printPepared(option?: number, note?: string) {
    this.currentOperation = FinancialOpEnum.REPRINT;
    const dialogInfoEvents = this.dialogService.openGenericInfo('Print', 'Print prepared...', undefined,
      undefined, true);

    let subExecute = (option === 0)
      ? this.invoiceService.send2Prepare(this.invoiceService.invoice!, this.authService.token!.username!, note!) :
      this.invoiceService.send2PrepareAll(this.invoiceService.invoice!, this.authService.token!.username!, note!);

    subExecute.subscribe((prepare: any) => {
        dialogInfoEvents!.close();
        //this.dialogService.openGenericInfo('Print', 'Print is finish');
      },
      err => {
        dialogInfoEvents!.close();
        this.dialogService.openGenericInfo('Error', 'Can\'t complete print operation');
      });
  }

  reprint() {
    console.log('reprint');
    // if (this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS) {
    if (this.invoiceService.digits) {
      this.getCheckById(EOperationType.Reprint, i => {
        this.invoiceService.resetDigits();
        this.print(i);
      });
    } else if (this.invoiceService.isReviewed || this.invoiceService.isRecalled
      || this.invoiceService.invoice!.productOrders.length) {
      this.print(this.invoiceService.invoice!);
    }
    /*else {
      this.keyboard(FinancialOpEnum.REPRINT);
    }
     */

    /*} else {
      console.error('Can\'t complete print operation');
      this.dialogService.openGenericInfo('Error', 'Can\'t complete print operation due to invoice is in progress.');
      this.invoiceService.resetDigits();
    }*/

  }

  print(i: Invoice) {
    this.currentOperation = FinancialOpEnum.REPRINT;
    const dialogInfoEvents = this.dialogService.openGenericAlert(DialogType.DT_INFORMATION,
      'Print', 'Printing ticket...', undefined, DialogConfirm.BTN_NONE);

    this.invoiceService.print(i).subscribe(
      data => {
        dialogInfoEvents!.close();
        //this.dialogService.openGenericInfo('Print', 'Print is finish');
      },
      err => {
        dialogInfoEvents!.close();
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t complete print operation',
          undefined, DialogConfirm.BTN_NONE);
      });
  }

  onAddProduct() {
    this.resetInactivity(true);
  }

  scanProduct() {
    this.currentOperation = ScanOpEnum.SCAN_PROD;
    this.addProduct(EOperationType.Scanner);
  }

  isWeightFormatProduct(): boolean {
    return this.invoiceService.numbers.length === 12 && this.invoiceService.numbers.startsWith('2') &&
      this.invoiceService.numbers.substring(7, 11) !== '0000';
  }

  getPriceAndUPCOfWFP() {
    this.invoiceService.priceWic = this.invoiceService.numbers.substring(7, 11);
    const upc = this.invoiceService.numbers.substring(0, 6);
    this.invoiceService.numbers = upc + '000000';
  }

  calculatorTips(data: any, action?: any): Observable<any> {
    return this.dialogService.dialog.open(CalculatorTipComponent, {
      /*width: '584px', height: '880px',*/
      data: data,
      disableClose: true
    }).afterClosed()
  }

  ebt(type?: number, splitAmount?: number) {
    console.log('EBT Card');
    this.currentOperation = 'EBT Card';
    let amount2Paid;
    if (this.invoiceService.invoice!.total !== 0 || this.invoiceService.invoice!.fsTotal !== 0) {
      const dialogInfoEvents = this.openInfoEventDialog(PaymentMethodEnum.EBT_CARD);

      amount2Paid = (type === EBTTypes.EBT_CASH && this.invoiceService.invoice!.fsTotal === 0) ?
        this.invoiceService.invoice!.balance : this.invoiceService.invoice!.fsTotal;
      this.invoiceService.ebt(splitAmount ? splitAmount : amount2Paid!, type!)
        .subscribe(data => {
          console.log(data);
          if (data.status === InvoiceStatus.PAID) {
            this.invoiceService.createInvoice();
            this.cashService.resetEnableState();
          } else {
            this.invoiceService.setInvoice(data);
            this.cashService.ebtEnableState();
          }
        }, err => {
          console.log(err);
          this.resetTotalFromFS();
          dialogInfoEvents.close();
          this.dialogService.openGenericInfo('Error', err);
          this.cashService.resetEnableState();
        }, () => dialogInfoEvents.close());
    }
    this.resetInactivity(true);
  }

  payZeroByDiscount(total?: number) {
    return this.invoiceService.invoice!.isDiscount && (total ? total === 0 : this.invoiceService.invoice!.total === 0);
  }

  debit() {
    if (this.invoiceService.invoice!.isRefund) {
      this.cash();
    } else if (this.invoiceService.invoice!.total !== 0) {
      this.setTip(this.debitOp, undefined, this);
    }
    this.resetInactivity(true);
  }

  getPaymetType(op?: PaymentOpEnum) {
    let paymentType: PaymentStatus = PaymentStatus.SALE;
    if (this.cashService.config.sysConfig.allowAuth &&
      this.invoiceService.invoice!.paymentStatus !== PaymentStatus.AUTH) {
      paymentType = PaymentStatus.AUTH;
    } else if (this.cashService.config.sysConfig.allowAuth &&
      this.invoiceService.invoice!.paymentStatus === PaymentStatus.AUTH) {
      paymentType = op === PaymentOpEnum.CREDIT_CARD ?
        this.invoiceService.invoice!.balance! > 0 ? PaymentStatus.AUTH : PaymentStatus.POSTAUTH
        : PaymentStatus.ADJUST;
    } else if (!this.cashService.config.sysConfig.allowAuth
      && this.invoiceService.invoice!.status === InvoiceStatus.PENDENT_FOR_AUTHORIZATION) {
      paymentType = PaymentStatus.ADJUST;
    }
    return paymentType;
  }

  setTip(action?: (i?: any, j?: any, k?: any) => void, op?: PaymentOpEnum, context?: any) {

    this.calculatorTips(
      {
        amountPaid: this.getTotalToPaid(op),
        amountSubTotal: this.invoiceService.invoice?.subTotal!,
        amountBalance: this.invoiceService.invoice?.balance,
        checkBalance: true,
        isRefund: this.invoiceService.invoice?.isRefund
      }
    ).subscribe((next: any) => {
      console.log(next);

      if (next) {
        this.invoiceService.invoice!.tip = next.cashTip;

        (op === PaymentOpEnum.CREDIT_CARD) ?
          this.creditOp(next.cashInvoice, null, this.getPaymetType(op)) :
          action!(context, this.getPaymetType(op), next.cashInvoice);
      }
    });

    //if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT &&
    //  !(this.invoiceService.invoice!.isRefund || this.invoiceService.invoice!.isRefundSale) &&
    //    (
    //    (this.invoiceService.invoice!.paymentStatus === PaymentStatus.AUTH &&
    //    this.cashService.config.sysConfig.tipWithoutAuth !== true)
    //    ||
    //    (this.invoiceService.invoice!.paymentStatus !== PaymentStatus.AUTH &&
    //      this.cashService.config.sysConfig.tipWithoutAuth === true)
    //    )
    //  ) {
    //  this.dialogService.dialog.open(ProductGenericComponent,
    //    {
    //      width: '448px', height: '540px', data: {unitCost: 0, name: 'Tip', label: 'Tip'},
    //      disableClose: true
    //    }).afterClosed().subscribe(
    //    (next:any) => {
    //      console.log(next);
    //      //if(next.unitCost >= 0) {
    //        this.invoiceService.invoice!.tip = next.unitCost;
    //        (op === PaymentOpEnum.CREDIT_CARD) ? action!(null, context, this.getPaymetType(op)) :
    //          action!(context, this.getPaymetType(op));
    //      /* } else {
    //        console.error('Not was set a valid tip');
    //      } */
    //    },
    //    (err:any) => {console.error(err); });
    //} else {
    //  (op === PaymentOpEnum.CREDIT_CARD) ?
    //    this.setCreditCardType(undefined, this.getPaymetType(op)) :
    //    action!(context, this.getPaymetType(op));
    //}
  }

  /* ********************* Solo se envia el balance     **************************** */
  debitOp(context?: any, transferType?: PaymentStatus, amount?: number) {
    if (!context) {
      context = this;
    }

    context.currentOperation = PaymentOpEnum.DEBIT_CARD;
    const opMsg = 'debit card payment';
    const dialogInfoEvents = context.openInfoEventDialog(PaymentMethodEnum.DEBIT_CARD);

    const $debit = context.invoiceService.debit(amount ? amount : context.invoiceService.invoice.balance,
      context.invoiceService.invoice.tip, transferType)
      .subscribe((data: any) => {
        context.closeTimeout(dialogInfoEvents, timeOut, data);
        context.setOrCreateInvoice(data, PaymentOpEnum.CREDIT_CARD, amount);
      }, (err: any) => {
        context.closeTimeout(dialogInfoEvents, timeOut, err);
        context.dialogService.openGenericInfo('Error', err);
        context.cashService.resetEnableState();
      });

    const timeOut = context.paxTimeOut($debit, dialogInfoEvents, opMsg);
  }

  closeTimeout(dialog: MatDialogRef<any>, timeOut: number, data?: any) {
    console.log(data);
    dialog.close();
    clearTimeout(timeOut);
  }

  credit() {
    console.log('Credit Card');
    if (this.invoiceService.invoice!.total !== 0) {
      this.setTip(this.creditOp, PaymentOpEnum.CREDIT_CARD, this);
    }
    this.resetInactivity(true);
  }

  public PaidInline(codeOperation: string, amount?: number, paymentOp?: PaymentOpEnum, tips?: number) {

    const dialogInfoEvents =
      this.dialogService.openDialog(DlgPayMethodComponent, "", "432px", "386px", false,
        {
          paymentMethod: PaymentMethodEnum.Online
        })

    this.invoiceService.cashOnline(amount!, codeOperation,
      this.getTotalToPaid(paymentOp!), paymentOp!, tips!).subscribe((next: Invoice) => {
      dialogInfoEvents.close();
      this.setOrCreateInvoice(next, paymentOp!, amount);
      console.log(next);
    }, error => {
      dialogInfoEvents.close();
      this.dialogService.openGenericInfo("Error", error)
    });

  }

  /* ???  ************* Solo se envia el balance ******************  ??? */

  externalCardPayment(title = 'External Card', client?: any, op?: PaymentOpEnum,
                      ebtType?: EBTTypes, amount?: number) {
    console.log('External Card');
    const total = ebtType === EBTTypes.EBT ?
      this.invoiceService.invoice!.fsTotal :
      this.getTotalToPaid(op).toFixed(2);


    this.getPriceField(title + '. Total: ' + total, 'Amount', amount!)
      .subscribe((amount: any) => {
        console.log('Amount', amount.unitCost);
        if (amount.unitCost) {
          const card = {number: '', authCode: ''};
          op === PaymentOpEnum.EBT_CARD ?
            this.externalCardPaymentOp(amount.unitCost, card.number, card.authCode, '', client,
              (ebtType === EBTTypes.EBT ? PaymentMethodEnum.EBT_CARD : PaymentMethodEnum.EBT_CASH)) :
            this.externalCardPaymentOp(amount.unitCost, card.number, card.authCode, '', client,
              (op === PaymentOpEnum.CREDIT_CARD) ? PaymentMethodEnum.CREDIT_CARD : PaymentMethodEnum.DEBIT_CARD);
        }
      });

  }

  externalCardPaymentOp(amount: any, cardNumber: any, authCode: any, cardType: any, client: any, op?: any) {
    const dialogInfoEvents = this.openInfoEventDialog(PaymentMethodEnum.OTHER);
    this.invoiceService.externalCard(amount, cardNumber, authCode, cardType, client, op).subscribe(
      (next: any) => {
        dialogInfoEvents.close();
        console.log('External Card', next);
        this.currentOperation = PaymentMethodEnum[op];
        if (!client) {
          if (next && next.balance > 0) {
            this.invoiceService.setInvoice(next);
            this.tableService.setTableStatus(StatusTable.BUSY);
          } else {
            this.tableService.setTableStatus(StatusTable.AVAILABLE);
            this.invoiceService.removeInvoice();
          }
          this.gotoRouter();
        } else {
          console.log('External Card for Account Payment', next);
          this.dialogService.openGenericInfo(InformationType.INFO, ' The account client (' + next['name']
            + ') was charged with ' + amount.toFixed(2));
        }
        this.cashService.resetEnableState();
      },
      error1 => {
        dialogInfoEvents.close();
        console.error('External Card', error1);
        this.dialogService.openGenericInfo('Error', error1);
        this.cashService.resetEnableState();
      }
    );
  }

  getCreditCardType(amount: any, cardNumber: any, authCode: any, client?: any, op?: any) {
    this.invoiceService.getExternalCadTypes().subscribe(
      (next: any) => {
        const ccTypes: any[] = [];
        console.log('getExternalCardTypes', next);
        if (next.length > 0) {
          next.map((val: any) => ccTypes.push({value: val, receiptNumber: val}));
          this.utils.openDialogInvoices(ccTypes, next => {
              this.externalCardPaymentOp(amount, cardNumber, authCode, next.value, client, op);
            }, 'Can\'t complete external card payment operation because the card type not was selected',
            'Card Payment Types', 'Select a card type:');
        } else {
          this.dialogService.openGenericInfo('Error', 'Can\'t complete external card payment '
            + 'operation because there aren\'t card types to select');
          this.cashService.resetEnableState();
        }
      },
      error1 => {
        console.error(error1);
        this.dialogService.openGenericInfo('Error', 'Can\'t complete external card payment '
          + 'operation because there aren\'t card types to select');
        this.cashService.resetEnableState();
      });
  }

  existsProductOrderStar() {
    return this.invoiceService.invoice!.productOrders!.filter(p => p.isStar).length > 0
  }

  public printLast() {
    this.invoiceService.printLastInvoice();
    this.resetInactivity(true);
  }

  scanInvoice() {
    if (this.invoiceService.invoice!.status === InvoiceStatus.IN_PROGRESS) {
      this.dialogService.openGenericInfo('Error', 'Scan invoice operation is not allow if a invoice is in progress');
      this.invoiceService.resetDigits();
    }
  }

  paidInOrOut() {
    if (this.invoiceService.invoice!.status !== InvoiceStatus.IN_PROGRESS) {
      const paidTypes = new Array<any>({value: 1, text: 'Paid Out'}, {value: 2, text: 'Paid In'});
      this.dialogService.dialog.open(DialogDeliveryComponent,
        {
          width: '600px', height: '340px', data: {
            name: 'Paid type selection',
            label: 'Please select type of Paid', arr: paidTypes
          },
          disableClose: true
        })
        .afterClosed().subscribe((next: any) => {
        console.log(next);
        this.paidOut(next);
      });
    } else {
      this.dialogService.openGenericInfo('Error', 'Paid out operation is not allow if a invoice is in progress');
    }
    this.resetInactivity(true);
  }

  paidOut(type?: number) {
    const title = (type === 1 || !type) ? 'Paid Out' : 'Paid In';
    this.dialogService.dialog.open(PaidOutComponent,
      {
        width: '480px', height: '600px', disableClose: true, data: {title: title}
      })
      .afterClosed().subscribe((data: string) => {
      console.log('paided out modal', data);
      if (data) {
        this.dialogService.dialog.open(DialogPaidoutComponent,
          {
            width: '1024px', height: '600px', disableClose: true, data: {title: title}
          })
          .afterClosed().subscribe((next: any) => {
          this.invoiceService.addPaidOut(data, next.text, type).subscribe(next => {
            console.log('paided out service', data, next);
          }, error1 => {
            console.error('paid out', error1);
            this.dialogService.openGenericInfo('Error', 'Can\'t complete paid out operation');
          });
        });
      }
    });
  }

  keyboard(action?: FinancialOpEnum | AdminOpEnum) {
    this.cashService.disabledInputKey = true;
    this.dialogService.dialog.open(DialogFilterComponent,
      {width: '1024px', height: '600px', data: {title: 'Enter Receipt Number'}, disableClose: true})
      .afterClosed()
      .subscribe((next: any) => {
        console.log('keyboard', next);
        this.cashService.disabledInputKey = false;
        if (next) {
          this.invoiceService.digits = next.text;
          if (action !== undefined) {
            switch (action) {
              case FinancialOpEnum.REFUND:
                this.refundOp();
                break;
              case FinancialOpEnum.REVIEW:
                this.reviewCheck();
                break;
              case FinancialOpEnum.REPRINT:
                this.reprint();
                break;
              case AdminOpEnum.CANCEL_CHECK:
                this.evCancelCheck.emit(true);
                break;
            }
          }
        } else if (!next && action === FinancialOpEnum.REVIEW || action === FinancialOpEnum.REFUND ||
          action === FinancialOpEnum.REPRINT) {
          this.cleanCurrentOp();
          this.invoiceService.isReviewed = false;
          this.invoiceService.isRecalled = false;
        }
      });
  }

  cleanCurrentOp() {
    this.currentOperation = '';
  }

  txType() {
    const txTypes = new Array<any>(
      {value: ETXType.DINEIN, text: ETXType[ETXType.DINEIN], color: 'blueC'},
      {value: ETXType.PICKUP, text: ETXType[ETXType.PICKUP], color: 'blueC'},
      {value: ETXType.DELIVERY, text: ETXType[ETXType.DELIVERY], color: 'blueC'},
      {value: ETXType.RETAIL, text: ETXType[ETXType.RETAIL], color: 'blueC'},
      {value: ETXType.FAST_FOOD, text: ETXType[ETXType.FAST_FOOD], color: 'blueC'},
    );
    if (!this.cashService.config.sysConfig.allowRetailInRestaurant) {
      txTypes.splice(3, 1);
    }
    this.dialogService.dialog.open(DialogDeliveryComponent,
      {width: '420px', height: '340px', data: {arr: txTypes}, disableClose: true})
      .afterClosed().subscribe((next: any) => {
      console.log('dialog delivery', next);
      if (next) {
        this.invoiceService.invoice!.type = next;
        switch (this.invoiceService.invoice!.type) {
          case ETXType.DINEIN:
            this.dineIn();
            break;
          case ETXType.DELIVERY:
            this.delivery();
            break;
          case ETXType.PICKUP:
            this.pickUp();
            break;
          case ETXType.RETAIL:
            this.retail();
            break;
        }
      }
    });
  }

  setCreditCardType(splitAmount?: number, transferPayment?: PaymentStatus) {
    const ccTypes = new Array<any>({value: 1, text: 'Automatic'}, {value: 2, text: 'Manual'});
    if (this.cashService.config.sysConfig.allowEBT) {
      [{value: 3, text: 'EBT'}, {value: 4, text: 'EBT Cash'}].map(op => ccTypes.push(op));
    }

    this.dialogService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '340px', data: {name: 'Credit Card Types', label: 'Select a type', arr: ccTypes},
        disableClose: true
      })
      .afterClosed().subscribe((next: any) => {
      console.log(next);
      switch (next) {
        case 1:
          this.creditOp(splitAmount, null, transferPayment);
          break;
        case 2:
          this.creditManualOp('Credit Card', splitAmount);
          break;
        case 3:
          this.ebt(EBTTypes.EBT, splitAmount);
          break;
        case 4:
          this.ebt(EBTTypes.EBT_CASH, splitAmount);
          break;
        default:
          this.cashService.resetEnableState();
          this.resetTotalFromFS();
      }
    });
  }

  setEBTCardType() {
    const ccTypes = new Array<any>({value: EBTTypes.EBT, text: 'EBT'}, {value: EBTTypes.EBT_CASH, text: 'EBT Cash'});
    if (this.invoiceService.invoice!.fsTotal! <= 0) {
      ccTypes.splice(0, 1);
    }
    this.dialogService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '340px', data: {name: 'EBT Card Types', label: 'Select a type', arr: ccTypes},
        disableClose: true
      })
      .afterClosed().subscribe((next: any) => {
      console.log(next);
      if (next !== '') {
        this.cashService.config.sysConfig.paxConnType === PAXConnTypeEnum.OFFLINE ?
          this.externalCardPayment(undefined, undefined, PaymentOpEnum.EBT_CARD, next) :
          this.ebt(next);
      }
    });
  }

  retail() {
    console.log('set order to retail');
    this.invoiceService.setRetail().subscribe(next => {
      if (next) {
        this.invoiceService.order = next;
        this.dialogService.openGenericInfo('Information', 'This order was set to "Retail"');
      }
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete set retail operation');
    });
  }

  dineIn() {
    this.openDialogTables();
  }

  pickUp() {
    const title = 'Pick up';
    // if(this.invoiceService.invoice.status !== InvoiceStatus.IN_PROGRESS){
    this.getField(title, 'Client Name', EFieldType.NAME).subscribe((name) => {
      console.log('pick up modal', name);
      if (name.text) {
        this.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
          if (phone.number) {
            this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
              if (!descrip.text) {
                console.log('pick up no set description');
              }
              this.invoiceService.setPickUp(name.text, phone.number, descrip.text).subscribe(order => {
                console.log('pick up this order', order);
                this.invoiceService.order = order;
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

  delivery() {
    const title = 'Delivery';
    this.getField(title, 'Client Name', EFieldType.NAME).subscribe(name => {
      if (name) {
        // order.type.client.name = name.text;
        this.getField(title, 'Client Address', EFieldType.ADDRESS).subscribe(address => {
          if (address) {
            // order.type.client.address = address.text;
            this.getNumField(title, 'Client Phone', EFieldType.PHONE).subscribe(phone => {
              if (phone) {
                // order.type.client.telephone = phone.text;
                this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                  if (!descrip.text) {
                    console.log('delivery no set description');
                  }
                  this.invoiceService.setDelivery(name.text, address.text, phone.number, descrip.text).subscribe(order => {
                    console.log('delivery this order', order);
                    this.invoiceService.order = order;
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

  getField(title: any, field: any, fieldType?: EFieldType): Observable<any> {
    return this.dialogService.dialog.open(DialogFilterComponent,
      {
        width: '1024px', height: '600px', disableClose: true, data: {
          title: title + ' - ' + field,
          type: dataValidation(fieldType!)
        }
      }).afterClosed();
  }

  getNumField(name: any, label: any, fieldType?: EFieldType, height = '650'): Observable<any> {
    return this.dialogService.dialog.open(InputCcComponent,
      {
        width: '480px', height: height + 'px', data: {
          number: '', name: name, label: label,
          type: dataValidation(fieldType!)
        }, disableClose: true
      }).afterClosed();
  }

  getPriceField(name: any, label: any, amount?: number) {
    return this.dialogService.dialog.open(ProductGenericComponent,
      {
        width: '448px', height: '540px', data: {name: name, label: label, unitCost: amount! ? amount! : 0.00},
        disableClose: true
      }).afterClosed();
  }

  getTotalField(totalToPaid: number) {
    return this.dialogService.dialog.open(CashOpComponent,
      {
        width: '480px', height: '660px', data: totalToPaid, disableClose: true
      }).afterClosed();
  }

  openSwipeCredentialCard(title: string, content?: string) {
    return this.dialogService.dialog.open(SwipeCredentialCardComponent, {
      width: '400px', height: '350px', data: {
        title: title ? title : 'Swipe card',
        content: content,
        pass: 'test'
      },
      disableClose: true,
      autoFocus: false
    }).afterClosed();
  }

  getOrderInfo(): any/*: Observable<Order>*/ {
    console.log('getOrderInfo', this.invoiceService.invoice!.orderInfo); /*
    this.invoiceService.invoice.subscribe(next => console.log('Invoice', next));*/
    if (this.invoiceService.order && this.invoiceService.order.invoiceId === this.invoiceService.invoice!.id) {
      this.showOrderInfo(this.invoiceService.order);
    } else {
      return this.cashService.getOrder(this.invoiceService.invoice!.receiptNumber).subscribe(
        next => {
          console.log(next);
          this.invoiceService.order = next;
          this.showOrderInfo(this.invoiceService.order!);
        },
        err => {
          console.error(err);
          this.dialogService.openGenericInfo('Error', 'Can\'t complete get order operation');
        }
      );
    }
    this.resetInactivity(true);
  }

  showOrderInfo(order: Order) {
    // this.dialogService.openGenericInfo(OtherOpEnum.ORDER_INFO, ETXType[order.type.type]);
    this.dialogService.dialog.open(OrderInfoComponent,
      {
        width: '480px', height: '350px', data: {
          title: OtherOpEnum.ORDER_INFO, subtitle: ETXType[order.orderType],
          type: order.orderType
        }, disableClose: true
      });
  }

  notSale() {
    this.invoiceService.notSale().subscribe(d => {
      console.log('Open cash drawer.', d);
    });
    this.resetInactivity(true);
  }

  weightItem() {
    this.dialogService.dialog.open(ProductGenericComponent,
      {
        width: '448px', height: '540px', data: {name: 'Weight Item', label: 'Price', unitCost: 0.00},
        disableClose: true
      }).afterClosed().subscribe(
      (next: any) => {
        console.log('weightItem', next);
        if (next) {
          this.setWeightedProduct(next['unitCost']);
        }
      });
    this.resetInactivity(true);
  }

  setWeightedProduct(price: number) {
    if (this.invoiceService.digits) {
      // Send scanned product to invoice
      this.invoiceService.getProductByUpc(EOperationType.WeightItem).subscribe(
        (next: any) => {
          console.log(next);
          next['unitCost'] = price!;
          this.invoiceService.evAddProdByUPC.emit(next);
        },
        err => {
          this.dialogService.openGenericInfo('Error', 'Can\'t get product by upc');
        },
        () => this.invoiceService.resetDigits()
      );
    } else {
      if (!this.cashService.config.sysConfig.externalScale) {
        this.dialogService.dialog.open(ProductGenericComponent,
          {
            width: '448px',
            height: '540px',
            data: {name: 'Weight', label: 'Weight (Lbs)', unitCost: 0},
            disableClose: true
          }).afterClosed().subscribe((data: any) => {
          if (data) {
            this.invoiceService.weightItem(price, data.unitCost).subscribe(
              i => {
                this.invoiceService.setInvoice(i);
              },
              err => {
                this.invoiceService.resetDigits();
                this.dialogService.openGenericInfo('Error', 'Can\'t complete weight operation');
              }
            );
          } else {
            console.log('Weight not specified');
          }
        });
      } else {
        this.invoiceService.weightItem(price, 0).subscribe(
          i => {
            this.invoiceService.setInvoice(i);
          },
          err => {
            this.invoiceService.resetDigits();
            this.dialogService.openGenericInfo('Error', 'Can\'t complete weight operation');
          });
      }
    }
  }

  splitCard() {
    if (this.invoiceService.invoice!.balance) {
      this.dialogService.dialog.open(ProductGenericComponent,
        {
          width: '448px', height: '540px', data: {
            unitCost: 0, name: OtherOpEnum.SPLIT_CARD, label: 'Amount',
            max: this.invoiceService.invoice!.balance
          },
          disableClose: true
        }).afterClosed().subscribe(
        (next: any) => {
          console.log(next);
          if (next['unitCost'].toFixed(2) > this.invoiceService.invoice!.balance!) {
            this.dialogService.openGenericInfo('Error', 'The spècified amount is superior to amount to pay');
          } else {
            this.setCreditCardType(next['unitCost'].toFixed(2));
          }
        },
        (err: any) => {
          console.error(err);
        });
    } else {
      this.dialogService.openGenericInfo('Error', 'There is not amount to pay');
    }
    this.resetInactivity(true);
  }

  acctOpts() {
    const operations = [
      {value: 0, label: CustomerOpEnum.ACCT_BALANCE},
      {value: 1, label: CustomerOpEnum.ACCT_CHARGE},
      {value: 2, label: CustomerOpEnum.ACCT_PAYMENT}
    ];
    this.utils.openDialogWithPag(operations,
      (c) => this.chooseAcctOp(c), CustomerOpEnum.ACCT_OPT, 'Select a acct operation:',
      '', 'label');
  }

  chooseAcctOp(op: any) {
    console.log('chooseAcctOp', op);
    switch (op.label.toUpperCase()) {
      case CustomerOpEnum.ACCT_BALANCE.toUpperCase():
        this.acctBalance();
        break;
      case CustomerOpEnum.ACCT_PAYMENT.toUpperCase():
        this.acctPayment();
        break;
      case CustomerOpEnum.ACCT_CHARGE.toUpperCase():
        this.acctCharge();
        break;
    }
  }

  acctBalance() {
    console.log(CustomerOpEnum.ACCT_BALANCE);
    this.currentOperation = CustomerOpEnum.ACCT_BALANCE;
    this.clientService.getClients().subscribe(
      clients => {
        console.log(CustomerOpEnum.ACCT_BALANCE, clients);
        this.utils.openDialogWithPag(clients, (c) => this.showAccountInfo(c), 'Clients', 'Select a client:',
          '', 'name', 'credit');
      },
      error1 => {
        this.dialogService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');
  }

  showAccountInfo(account: Customer) {
    /*
    const client = {client: {name: account['name'], address: account.address, telephone: account['phone']}};
    const clientAccount = {balance: account.balance, credit: account.credit, creditLimit: account.creditLimit};
    this.dialogService.dialog.open(OrderInfoComponent,
      {
        width: '480px', height: '450px', data: {
          title: CustomerOpEnum.ACCT_BALANCE, subtitle: account.accountNumber,
          type: client, account: clientAccount
        }, disableClose: true
      }).afterClosed().subscribe(
      (next: any) => {
        if (next.print) {
          this.printBalance(account.id!);
        }
      }
    );
    */
  }

  acctCharge() {
    console.log(CustomerOpEnum.ACCT_CHARGE);
    this.clientService.getClients().subscribe(
      clients => {
        this.utils.openDialogWithPag(clients, (c) => this.setAmount(CustomerOpEnum.ACCT_CHARGE,
            a => this.acctChargeOp(c.id, a)), 'Clients', 'Select a client:', undefined, 'name',
          'balance');
      },
      error1 => {
        this.dialogService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
        this.cashService.resetEnableState();

      });

  }

  acctPayment() {
    console.log(CustomerOpEnum.ACCT_PAYMENT);
    this.currentOperation = CustomerOpEnum.ACCT_PAYMENT;
    this.clientService.getClients().subscribe(
      clients => {
        this.utils.openDialogWithPag(clients, (c) => this.selectPaymentType(c.id), 'Clients', 'Select a client:', 'name');
      },
      error1 => {
        this.dialogService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');

  }

  transferPayment() {
    this.setAmount('TRANSFER', (a) => {
      this.setDescription('TRANSFER', (d) => this.paidByTransfer(a, d));
    });
  }

  paidByTransfer(amount: number, descrip: string) {
    this.currentOperation = PaymentOpEnum.TRANSFER;
    const dialogInfoEvents = this.openInfoEventDialog(PaymentMethodEnum.TRANSFER);
    this.invoiceService.paidByTransfer(amount, descrip).subscribe(data => {
        console.log('paidByTransfer', data);
        dialogInfoEvents.close();
        this.setOrCreateInvoice(data, PaymentOpEnum.CREDIT_CARD, amount);
        this.cashService.resetEnableState();
      },
      err => {
        console.log(err);
        dialogInfoEvents.close();
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
        this.cashService.resetEnableState();
      });
  }

  acctPaymentCashOp(client: string, amount: number) {
    this.invoiceService.acctPaymentCash(client, amount).subscribe(
      (next: Invoice) => {
        console.log('acctPaymentOp', next);
        this.dialogService.openGenericInfo(InformationType.INFO, ' The account client (' + next['applicationUserName']
          + ') was charged with ' + amount.toFixed(2));
      },
      error1 => {
        console.error(error1);
        this.dialogService.openGenericInfo(InformationType.ERROR, error1);
      }
    );
  }

  check(client?: string) {
    const title = 'Check Payment';
    this.invoiceService.resetDigits();
    console.log(title);
    this.getPriceField(title + '. Total: ' + this.getTotalToPaid().toFixed(2), 'Amount')
      .subscribe((amount: any) => {
        console.log('Amount', amount.unitCost);
        if (amount.unitCost) {
          this.getNumField(title, 'Check number', EFieldType.NUMBER).subscribe(checkNumber => {
            if (checkNumber.number) {
              this.getField(title, 'Description', EFieldType.DESC).subscribe(descrip => {
                this.paidByCheck(amount.unitCost, checkNumber.number, descrip.text, client);
              });
            }
          });
        }
      });
    this.resetInactivity(true);
  }

  choosePAXConnType(op?: PaymentOpEnum) {
    const ccTypes = new Array<any>({value: 1, text: 'Online'}, {value: 2, text: 'Offline'});
    this.dialogService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '340px', data: {name: 'PAX Connection Types', label: 'Select a type', arr: ccTypes},
        disableClose: true
      })
      .afterClosed().subscribe((next: any) => {
      console.log(next);
      switch (next) {
        case 1:
          this.selectPaymentByOp(op!);
          break;
        case 2:
          this.externalCardPayment();
          break;
        default:
          this.cashService.resetEnableState();
          this.resetTotalFromFS();
      }
    });
  }

  detectPAXConn(op?: PaymentOpEnum, amount?: number) {
    switch (this.cashService.config.sysConfig.paxConnType) {
      case PAXConnTypeEnum.BOTH:
        this.choosePAXConnType(op);
        break;
      case PAXConnTypeEnum.OFFLINE:
        op === PaymentOpEnum.EBT_CARD ? this.setEBTCardType() :
          this.externalCardPayment(undefined, undefined, op, undefined, amount!);
        break;
      case PAXConnTypeEnum.ONLINE:
        this.selectPaymentByOp(op!);
        break;
    }
  }

  selectPaymentByOp(op: PaymentOpEnum) {
    switch (op) {
      case PaymentOpEnum.CREDIT_CARD:
        this.credit();
        break;
      case PaymentOpEnum.DEBIT_CARD:
        this.debit();
        break;
      case PaymentOpEnum.EBT_CARD:
        this.setEBTCardType();
        break;
    }
  }

  setOtherPaymentType(applyTip?: boolean) {
    const ccTypes = new Array<any>(
      {value: PaymentMethodEnum.OTHER, text: 'Others'},
      {value: PaymentMethodEnum.TRANSFER, text: 'Transfer'},
      {value: PaymentMethodEnum.GIFT_CARD, text: 'Gift Card'}
    );
    if (!this.cashService.config.sysConfig.allowGiftCard) {
      ccTypes.splice(-1);
    }
    this.dialogService.dialog.open(DialogDeliveryComponent, {
      width: '600px', height: '340px',
      data: {name: 'Other Payment Types', label: 'Select a type', arr: ccTypes},
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
      console.log(next);
      if (next !== '') {
        switch (next) {
          case PaymentMethodEnum.OTHER:
            this.cash(PaymentOpEnum.OTHER);
            break;
          case PaymentMethodEnum.TRANSFER:
            this.transferPayment();
            break;
          case PaymentMethodEnum.GIFT_CARD:
            this.giftCardPayment();
            break;
        }
      }
    });
  }

  giftCardPayment() {
    this.getTotalField(this.getTotalToPaid()).subscribe(
      (amount: any) => {
        console.log('giftCardPayment Amount', amount);
        if (amount) {
          this.cashService.disabledInput = false;
          this.openSwipeCredentialCard(PaymentOpEnum.GIFT_CARD, 'Swipe card')
            .subscribe(
              (next: any) => {
                console.log('Swipe card', next);
                if (next) {
                  const passwordByCard = (next) ? next.pass : this.initService.userScanned;
                  if (this.initService.userScanned) {
                    this.initService.cleanUserScanned();
                  }
                  if (passwordByCard) {
                    this.giftCardPaymentOp(amount, passwordByCard);
                  }
                }
              }
            );
        }
      });
  }

  giftCardPaymentOp(amount: any, cardPin: any) {
    this.currentOperation = PaymentOpEnum.GIFT_CARD;
    const opMsg = 'gift card payment';
    const dialogInfoEvents = this.dialogService.openGenericInfo('Gift Card', 'Paying by gift card...',
      undefined, undefined, true);
    const $gift = this.invoiceService.paidByGift(amount, cardPin)
      .subscribe(data => {
          console.log(data);
          dialogInfoEvents!.close();
          clearTimeout(timeOut);
          this.setOrCreateInvoice(data, PaymentOpEnum.CREDIT_CARD, amount);
        },
        err => {
          console.log(err);
          dialogInfoEvents!.close();
          clearTimeout(timeOut);
          this.dialogService.openGenericInfo('Error', err);
          this.cashService.resetEnableState();
        }, () => {
          clearTimeout(timeOut);
          this.cashService.resetEnableState();
        });

    const timeOut = this.paxTimeOut($gift, dialogInfoEvents!, opMsg);
  }

  changePriceOp(prod: Product) {
    this.dialogService.dialog.open(ProductGenericComponent,
      {
        width: '448px',
        height: '540px',
        data: {name: 'Change Price', label: 'Price', unitCost: prod.unitCost!.toFixed(2)},
        disableClose: true
      }).afterClosed().subscribe(
      (next: any) => {
        if (next) {
          this.invoiceService.updateProductsPrice(prod.upc!, next.unitCost, prod.id!).subscribe(next => {
              console.log(next);
              this.dialogService.openGenericInfo('Information', 'The price of product ' /* + next!.upc + ' was
               updated to ' + next.price!.toFixed(2)*/)!
                .afterClosed().subscribe((next: any) => this.router.navigateByUrl('/home/layout/invoice/departaments', {replaceUrl: true}));
            },
            err => {
              this.dialogService.openGenericInfo('Error', 'Can\'t change price of this product ' + prod.upc);
            },
            () => {
              this.currentOperation = '';
              this.evCleanAdminOperation.emit();
              this.cashService.resetEnableState();
            });
        }
      });
  }

  prepareFood() {
    this.currentOperation = OtherOpEnum.PREPARE;
    if (this.cashService.config.sysConfig.allowUserPrepareOrder) {
      this.getField(OtherOpEnum.PREPARE, 'Client Name', EFieldType.NAME).subscribe(name => {
        this.getField(OtherOpEnum.PREPARE, 'Notes', EFieldType.DESC).subscribe(note => {
          this.prepareFoodOp(name.text, note.text);
        });
      });
    } else {
      this.prepareFoodOp();
    }
  }

  prepareFoodOp(userName?: string, note?: string) {
    const dialogInfoEvents = this.dialogService.openGenericInfo(InformationType.INFO, 'Sending order for preparation...',
      undefined, undefined, true);
    this.invoiceService.send2Prepare(this.invoiceService.invoice!, userName, note).subscribe(
      data => {
        if (dialogInfoEvents) {
          dialogInfoEvents.close();
        }
        if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) {
          this.goTableLayout(false);
        } else if (this.cashService.config.sysConfig.prepareOrderToHoldInvoice) {
          //this.invoiceService.createInvoice();
        }
      },
      err => {
        if (dialogInfoEvents) {
          dialogInfoEvents.close();
        }
        this.utils.openGenericInfo(InformationType.INFO, err);
      },
      () => this.currentOperation = '');
  }

  changeProductOp(item: Product | Department) {
    this.changeItemOp(item).subscribe(next => {
        console.log(next);
        this.dialogService.openGenericInfo('Information', 'The color of ' +
          next['name'] + ' was updated to ' + next['color'].toUpperCase())!
          .afterClosed().subscribe((next: any) => this.router.navigateByUrl('/home/layout/invoice/departaments', {replaceUrl: true}));
      },
      err => {
        this.dialogService.openGenericInfo('Error', 'Can\'t change color');
      },
      () => {
        this.currentOperation = '';
        this.evCleanAdminOperation.emit();
        this.cashService.resetEnableState();
        this.invoiceService.resetDigits();
      });
  }

  changeItemOp(item: Product | Department): Observable<any> {
    return (<Product>item).upc ? this.invoiceService.updateProductsColor((<Product>item).upc!, (<Product>item).color!, item.id!) :
      this.invoiceService.updateDepartmentColor(item.color!, item.id!);
  }

  openAssignTable() {
    return this.dialogService.dialog.open(AssignTableComponent, {
      width: '820px', height: '613px', data: {},
      disableClose: true
    }).afterClosed();
  }

  cancelRefundOp(token?: string, action?: () => void) {
    this.invoiceService.deleteInvoice(this.invoiceService!.invoice?.id!)
      .subscribe((nextInvoice: Invoice) => {
        this.invoiceService.removeInvoice();
        this.authService.restoreInitialLogin();
        if (action) action();
      }, error => {
        //this.dialogService.openGenericInfo("Error", error)
        this.invoiceService.removeInvoice();
        this.authService.restoreInitialLogin();
        if (action) action();
      })
  }

  cancelRefund(action?: () => void) {
    this.authService.adminLogged() ?
      this.cancelRefundOp(undefined, action) : this.manager('cancelRefund', action);
  }

  gotoRouter() {
    if (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) {
      this.invoiceService.txType = ETXType.DINEIN;
      console.log("Entro")
      this.router.navigateByUrl("/home/layout/tables");
    } else {
      this.invoiceService.txType = ETXType.FAST_FOOD;
      this.router.navigateByUrl("/home/layout/invoice/departaments");
    }
  }

  gotoHome() {
    this.router.navigateByUrl("/home/layout/invoice/departaments");
  }

  applyDiscountInvoice(discount: number, type: EApplyDiscount, productId?: string) {

    let idProdOrders = new Array<string>();

    if (productId) {
      idProdOrders.push(productId);
    } else {
      idProdOrders = this.invoiceService.invoice!.productOrders!.map(v => v.id);
    }

    console.log('applyDiscountInvoice', idProdOrders);
    console.log('applyDiscountType', discount, type);
    this.dataStorage.applyDiscountInvoice(this.invoiceService.receiptNumber, discount, idProdOrders, type)
      .subscribe((next: Invoice) => {
        console.log("InventoryModel discount", next);
        this.invoiceService.setInvoice(next)
      });

  }

  reopenOrder(receiptNumber: string, gotoPage?: boolean) {
    debugger;
    if (this.invoiceService?.receiptNumber?.trim() === receiptNumber?.trim()) {
      if (gotoPage) {
        this.router.navigateByUrl("home/layout/invoice/departaments")
      }
    } else {
      this.invoiceService.digits = receiptNumber!;
      this.reviewCheck((invoice: Invoice) => {

        if (invoice!.order /*&& invoice?.order!.type*/ && invoice!.order!.tableId!) {

          this.tableService.setTableSelected(invoice!.order!.table!);

          this.invoiceService.setOrderEmit(invoice!.order!);

          if (gotoPage) {
            const status = [InvoiceStatus.CANCEL, InvoiceStatus.PAID];
            (invoice && status.includes(invoice!.status)) ?
              this.router.navigateByUrl("home/layout/orders/orderview") :
              this.router.navigateByUrl("home/layout/invoice/departaments")
          }

        } else {
          if (gotoPage) {
            const status = [InvoiceStatus.CANCEL, InvoiceStatus.PAID];
            (invoice && status.includes(invoice!.status)) ?
              this.router.navigateByUrl("home/layout/orders/orderview") :
              this.router.navigateByUrl("home/layout/invoice/departaments")
          }
        }
      });
    }
  }

  private deleteLastProduct() {
    if (this.invoiceService.invoiceProductSelected.length === 1) {
      const prodSel = this.invoiceService.invoiceProductSelected[0];
      if (prodSel.id === this.invoiceService.lastProdAdd!.id) {
        this.deleteSelectedProducts();
      } else {
        this.delSelProdByAdmin();
      }
    } else {
      this.delSelProdByAdmin();
    }
  }

  private creditOp(splitAmount?: number, context?: any, transferType?: PaymentStatus) {
    if (!context) {
      context = this;
    }

    context.currentOperation = PaymentOpEnum.CREDIT_CARD;
    const opMsg = 'credit card payment';
    const dialogInfoEvents = context.openInfoEventDialog(PaymentMethodEnum.CREDIT_CARD);

    const $credit = context.invoiceService.credit(splitAmount ? splitAmount : context.invoiceService.invoice.balance,
      context.invoiceService.invoice.tip, transferType)
      .subscribe((data: any) => {
          debugger;
          context.closeTimeout(dialogInfoEvents, timeOut, data);
          context.setOrCreateInvoice(data, PaymentOpEnum.CREDIT_CARD, splitAmount);
        },
        (err: any) => {
          debugger;
          context.closeTimeout(dialogInfoEvents, timeOut, err);
          context.dialogService.openGenericInfo('Error', err);
          context.cashService.resetEnableState();
        });

    const timeOut = context.paxTimeOut($credit, dialogInfoEvents, opMsg);
  }

  private creditManualOp(title: string, splitAmount?: number) {
    this.getNumField(title, 'Number', EFieldType.CARD_NUMBER).subscribe((number) => {
      console.log('cc manual modal', number);
      if (number.number) {
        this.getNumField(title, 'CVV', EFieldType.CVV).subscribe(cvv => {
          if (cvv.number) {
            this.getNumField(title, 'Exp. Date', EFieldType.EXPDATE).subscribe(date => {
              if (date.number) {
                this.getNumField(title, 'Zip Code', EFieldType.ZIPCODE).subscribe(zipcode => {
                  if (zipcode.number) {
                    this.currentOperation = PaymentOpEnum.CREDIT_CARD_MANUAL;
                    this.invoiceService.creditManual(splitAmount ? splitAmount : this.invoiceService.invoice!.balance!,
                      this.invoiceService.invoice!.tip, number.number, cvv.number, date.number, zipcode.number)
                      .subscribe(data => {
                          console.log(data);
                          this.setOrCreateInvoice(data, PaymentOpEnum.CREDIT_CARD, splitAmount);
                          this.cashService.resetEnableState();
                        },
                        err => {
                          console.log(err);
                          this.dialogService.openGenericInfo(InformationType.ERROR, err);
                          this.cashService.resetEnableState();
                        });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  private setOrCreateInvoice(data: Invoice, op?: PaymentOpEnum, payment?: number) {
    if (data && data.balance! > 0 && data.status !== InvoiceStatus.PAID) {
      this.tableService.setTableStatus(StatusTable.BUSY);
      this.invoiceService.setInvoice(data)
    } else {
      /* procedure product start */
      this.bsPaidDocument$.next({invoice: {...data}, payment: op!, paidInvoice: payment});
      this.tableService.setTableStatus(StatusTable.AVAILABLE);

      if (this.existsProductOrderStar()) {
        const productList = this.departProductService.getProducts();

        let valueToBeReturned = data.productOrders.map((value: ProductOrder) => {
          if (value.isStar) {
            let oringPrice = productList.filter((p: Product) => {
              return p.id === value.productId
            })[0];
            return (value.unitCost - oringPrice.currentPrice) * value.quantity;
          } else return 0;
        }).reduce((partialSum, a) => partialSum + a, 0);

        this.invoiceService.addPaidOut(
          valueToBeReturned.toFixed(2),
          "Star ->" + data.receiptNumber,
          1, data.applicationUserId)
          .subscribe(next => {
          }, error => {
            this.dialogService.openGenericInfo("Error", error)
          })
      }
      this.gotoRouter();
    }
  }

  private resetTotalFromFS() {
    this.invoiceService.invoice!.fsTotal = 0;
    this.invoiceService.evUpdateTotals.emit();
  }

  private saveStateTotals() {
    this.invTotalsBeforeFSSubTotal['total']! = this.invoiceService.invoice!.total;
    this.invTotalsBeforeFSSubTotal['subtotal'] = this.invoiceService.invoice!.subTotal!;
    this.invTotalsBeforeFSSubTotal['tax']! = this.invoiceService.invoice!.tax!;
  }

  private showBalance(c: any) {
    this.dialogService.openGenericInfo('Balance', 'The balance of client ' + c.name + ' is: $'
      + c.balance.toFixed(2));
  }

  private printBalance(clientId: string) {
    const dialog = this.dialogService.openGenericInfo(InformationType.INFO, 'Printing balance');
    this.invoiceService.printAcctBalance(clientId).subscribe(
      next => {
        dialog!.close();
        console.log('printBalance', next);
      }, err => {
        dialog!.close();
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    );
  }

  private setAmount(titleOp: string, action: (i: any) => void) {
    this.getPriceField(titleOp + '. Total: ' + this.getTotalToPaid().toFixed(2), 'Amount')
      .subscribe(
        (amount: any) => {
          console.log('setAmount', amount);
          action(amount.unitCost);
        }
      );
  }

  private setDescription(titleOp: string, action: (i: any) => void) {
    console.log('setDescription');
    this.getField(titleOp, 'Description', EFieldType.DESC)
      .subscribe(
        descrip => {
          console.log('setDescription', descrip);
          action(descrip.text);
        }
      );
  }

  private acctChargeOp(client: any, amount: any) {
    if (amount) {
      this.currentOperation = CustomerOpEnum.ACCT_CHARGE;
      this.invoiceService.acctCharge(client, amount).subscribe(
        (next: any) => {
          console.log('setAmount', next);
          (next && next.balance > 0) ? this.invoiceService.setInvoice(next) : this.invoiceService.createInvoice();
          this.cashService.resetEnableState();
        }, error1 => {
          console.error('setAmount', error1);
          this.dialogService.openGenericInfo(InformationType.ERROR, error1);
          this.cashService.resetEnableState();
        }
      );
    }
  }

  private selectPaymentType(c: string) {
    this.utils.openDialogWithPag([{label: 'CARD'}, {label: 'CASH'}, {label: 'CHECK'}, {label: 'TRANSFER'}], i => {
        console.log(i);
        switch (i.label) {
          case 'CASH':
            this.setAmount(i.label, (a) => this.acctPaymentCashOp(c, a));
            break;
          case 'CARD':
            this.externalCardPayment(CustomerOpEnum.ACCT_PAYMENT, c);
            break;
          case 'CHECK':
            this.check(c);
            break;
          case 'TRANSFER':
            this.setAmount(i.label, (a) => this.setDescription(i.label, (d) => this.acctPaymentTransferOp(c, a, d)));
            break;
        }
      }, CustomerOpEnum.ACCT_PAYMENT,
      'Select a payment type', 'label');
  }

  private paidByCheck(amount: number, checkNumber: string, descrip?: string, client?: string) {
    const dialogInfoEvents = this.openInfoEventDialog(PaymentMethodEnum.CHECK);
    this.invoiceService.paidByCheck(amount, checkNumber, descrip, client).subscribe(
      (next: Invoice) => {
        console.log('paidByCheck', next);
        dialogInfoEvents.close();
        this.currentOperation = PaymentOpEnum.CHECK;
        if (!client) {
          if (next && next.balance! > 0) {
            this.invoiceService.setInvoice(next);
          } else if (next.change && next.change > 0) {
            this.paymentReturn(next.change).subscribe((result: any) => {
              if (result.closeAutomatic) this.logoutOp();
              /*: this.invoiceService.createInvoice(); */
            });
          } else if (next.balance! <= 0) {
            //this.invoiceService.createInvoice();
          }
        } else {
          console.log('Check for Account Payment', next);
          this.dialogService.openGenericInfo(InformationType.INFO, ' The account client (' + next.orderInfo
            + ') was charged with ' + amount.toFixed(2));
        }
        this.cashService.resetEnableState();
      },
      error1 => {
        console.error('paidByCheck', error1);
        dialogInfoEvents.close();
        this.dialogService.openGenericInfo('Error', error1);
        this.cashService.resetEnableState();
      }
    );
  }

  private acctPaymentTransferOp(client: string, amount: any, descrip: any) {
    this.invoiceService.acctPaymentTransfer(client, amount, descrip).subscribe(
      next => {
        console.log('acctPaymentTransferOp', next);
        this.currentOperation = PaymentOpEnum.TRANSFER;
        this.dialogService.openGenericInfo(InformationType.INFO, ' The account client (' + next.receiptNumber
          + ') was charged with ' + amount.toFixed(2));
        this.cashService.resetEnableState();
      },
      error1 => {
        console.error(error1);
        this.dialogService.openGenericInfo(InformationType.ERROR, error1);
        this.cashService.resetEnableState();
      }
    );
  }

  private resetCurrentOperation() {
    let ops = [PaymentOpEnum.DEBIT_CARD, PaymentOpEnum.CREDIT_CARD, PaymentOpEnum.CREDIT_CARD_MANUAL,
      TotalsOpEnum.SUBTOTAL].map(op => op + "");
    if (ops.includes(this.currentOperation!) && this.invoiceService.invoice!.status === InvoiceStatus.PENDENT_FOR_PAYMENT) {
      console.log('resetSubTotal');
      this.resetSubTotalState();
    }
    this.currentOperation = '';
  }
}
