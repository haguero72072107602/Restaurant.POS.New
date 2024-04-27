import {Injectable} from '@angular/core';
import {InvoiceService} from './invoice.service';
import {CashService} from './cash.service';
import {EOperationType} from '../../utils/operation.type.enum';
import {InvoiceStatus} from '../../utils/invoice-status.enum';
import {OperationsService} from './operations.service';
import {DataStorageService} from '../api/data-storage.service';
import {AuthService} from '../api/auth.service';
import {AdminOpEnum} from '../../utils/operations/admin-op.enum';
import {ETransferType} from '../../utils/transfer-type.enum';
import {EApplyDiscount} from '../../utils/apply-discount.enum';
import {Router} from '@angular/router';
import {EFieldType} from '../../utils/field-type.enum';
import {Observable} from 'rxjs';
import {InformationType} from '../../utils/information-type.enum';
import {InitViewService} from './init-view.service';
import {CustomerOpEnum} from '../../utils/operations/customer.enum';
import {ClientService} from './client.service';
import {dateFormatter, removeTFromISODate, thousandFormatter} from '../../utils/functions/transformers';
import {DialogService} from './dialog.service';
import {EmployActions} from '../../utils/employ-actions.enum';
import {Department} from 'src/app/models/department.model';
import {DialogDeliveryComponent} from "@shared/components/dialog-delivery/dialog-delivery.component";
import {ApplyDiscountComponent} from "@shared/components/apply-discount/apply-discount.component";
import {ProductGenericComponent} from "@shared/components/product-generic/product-generic.component";
import {GenericSalesComponent} from "@shared/components/generic-sales/generic-sales.component";
import {SetDateComponent} from "@shared/components/set-date/set-date.component";
import {environment} from "../../../../environments/environment";
import {Invoice} from "@models/invoice.model";
import {CloseBatchComponent} from "@shared/components/close-batch/close-batch.component";
import {DialogInvoiceComponent} from "@shared/components/dialog-invoice/dialog-invoice.component";
import {EmployeedModel, IPositionModel} from "@models/employeed.model";
import {Credentials, CredentialsModel} from "@models/credentials.model";
import {EbtInquiryInfoComponent} from "@shared/components/ebt-inquiry-info/ebt-inquiry-info.component";
import {GiftCardModel, GiftModel} from "@models/gift-card.model";
import {FinancialReportComponent} from '@shared/components/financial-report/financial-report.component';
import {RangeDateComponent} from "@shared/components/range-date/range-date.component";
import {Product} from "@models/product.model";
import {AdminOperationService} from '@core/services/api/admin.operation.service';
import {User} from '@models/user.model';
import {baseURL} from '@core/utils/url.path.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminOptionsService {
  currentOperation?: AdminOpEnum | string;
  private cancelCheckLoaded?: boolean;
  private removeHoldLoaded?: boolean;

  constructor(private invoiceService: InvoiceService, public cashService: CashService, public auth: AuthService,
              public operationService: OperationsService, private dataStorage: DataStorageService, private utils: DialogService,
              private initService: InitViewService, private clientService: ClientService,
              private dialogService: DialogService,
              private adminOperationService: AdminOperationService,
              private router: Router /*, private translate: TranslateService*/) {

    this.operationService.evCancelCheck.subscribe(next => {
      next ? this.cancelCheck() : this.cancelCheckLoaded = false;
    });

    this.operationService.evRemoveHold.subscribe(next => {
      this.removeHoldLoaded = false;
    });

    this.operationService.evCleanAdminOperation.subscribe(next => {
      this.currentOperation = '';
    });

    this.operationService.evBackUserOperation.subscribe(next => {
      this.backToUser();
    });
  }

  setApplyDiscountType() {
    const adTypes = new Array<any>({value: EApplyDiscount.PERCENT, text: EApplyDiscount[EApplyDiscount.PERCENT]},
      {value: EApplyDiscount.AMOUNT, text: EApplyDiscount[EApplyDiscount.AMOUNT]});
    this.dialogService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '340px', data: {name: 'Apply Discount Types', label: 'Select a type', arr: adTypes},
        disableClose: true
      })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.applyDiscount(EApplyDiscount.PERCENT);
          break;
        case 2:
          this.applyDiscount(EApplyDiscount.AMOUNT);
          break;
      }
    });
  }

  applyDiscount(type: EApplyDiscount) {
    // if(this.invoiceService.invoice.productOrders.length > 0){
    const dialogRef = (type === EApplyDiscount.PERCENT) ?
      this.dialogService.dialog.open(ApplyDiscountComponent,
        {
          width: '480px', height: '600px', disableClose: true
        }) :
      this.dialogService.dialog.open(ProductGenericComponent,
        {
          width: '448px', height: '540px', data: {name: 'Apply Discount', label: 'Discount (amount)', unitCost: 0},
          disableClose: true
        });
    dialogRef.afterClosed().subscribe((data: any) => {
      console.log('apply discount', data);
      if (data !== "") {
        if (type === EApplyDiscount.AMOUNT) {
          data = (data['unitCost']) ? Number(data['unitCost']).toFixed(2) : 0;
          if ((this.invoiceService.invoiceProductSelected.length < this.invoiceService.invoice!.productOrders.length)
            && (this.invoiceService.invoiceProductSelected.length > 1)) {
            this.dialogService.openGenericInfo('Information', 'Discount by amount only can apply for a ' +
              'product or full invoice');
          } else {
            this.applyDiscountOp(data, type);
          }
        } else if (type === EApplyDiscount.PERCENT) {
          this.applyDiscountOp(data, type);
        } else {
          console.error("Not was specified a valid apply discount method");
        }
      } else {
        console.error("Not was specified a valid amount");
      }
    });
  }

  applyDiscountOp(data: any, type: EApplyDiscount) {
    this.invoiceService.applyDiscountInvoice(data, type).subscribe(next => {
      this.invoiceService.setInvoice(next);
      this.invoiceService.invoiceProductSelected.splice(0);
    }, err => {
      // this.dialogService.openGenericInfo('Error', 'Can\'t apply discount');
      this.dialogService.openGenericInfo('Error', err);
    });
  }

  cancelCheck() {
    console.log('cancelCheck');
    this.operationService.currentOperation = AdminOpEnum.CANCEL_CHECK;
    if (this.invoiceService.invoice!.status !== InvoiceStatus.IN_PROGRESS) {
      (this.invoiceService.digits || this.cancelCheckLoaded) ?
        this.cancelCheckOp()
        : this.operationService.keyboard(AdminOpEnum.CANCEL_CHECK);
      // this.dialogService.openGenericInfo('Error', 'Please input receipt number of check');

    } else {
      console.error('Can\'t complete cancel check operation');
      this.invoiceService.resetDigits();
      this.dialogService.openGenericInfo('Error', 'Can\'t complete cancel check operation because check is in progress');
    }
  }

  cancelCheckOp() {
    this.cancelCheckLoaded ?
      this.doCancelCheck() :
      this.invoiceService.getInvoicesById(EOperationType.CancelCheck)
        .subscribe(next => {
          this.invoiceService.setInvoice(next);
          this.cancelCheckLoaded = true;
          this.cashService.cancelCheckEnableState();
          // this.operationService.currentOperation = FinancialOpEnum.REVIEW;
        }, err => this.dialogService.openGenericInfo('Error', 'Can\'t complete cancel check operation'));
  }

  doCancelCheck() {
    this.invoiceService.cancelCheck();
    this.cancelCheckLoaded = false;
  }

  sysZ() {
    this.dataStorage.getPaymentByType().subscribe(next => {
      console.log(AdminOpEnum.SYSZ, next);
      this.dialogService.dialog.open(GenericSalesComponent,
        {
          width: '480px', height: '640px', disableClose: true, data: {title: AdminOpEnum.SYSZ, content: next}
        });
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + AdminOpEnum.SYSZ + ' operation');
    });
    this.operationService.resetInactivity(true, 'sysZ');
  }

  emplZ() {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log(AdminOpEnum.EMPLZ, next);
      next.unshift({id: '-1', userName: 'ALL'});
      this.operationService.openDialogWithPag(next, (e) => this.showStatusInvoices(AdminOpEnum.EMPLZ, e),
        AdminOpEnum.EMPLZ + ' - Employees', 'Select a employee:', '', 'userName');
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + AdminOpEnum.EMPLZ + ' operation');
    });
    this.operationService.resetInactivity(true, 'empZ');
  }

  showStatusInvoices(op: AdminOpEnum, emp?: string) {
    this.dataStorage.getStatusInvoices().subscribe(next => {
      console.log('Invoices status', next);
      this.operationService.openDialogWithPag(next,
        (e) => this.showSalesByEmployee(AdminOpEnum.EMPLZ, emp, e.id),
        AdminOpEnum.EMPLZ + ' - Invoices state', 'Select a invoices state:', '', 'name');
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + AdminOpEnum.EMPLZ + ' operation');
    });
  }

  showSalesByEmployee(op: AdminOpEnum, emp?: string, status?: string) {
    this.dialogService.dialog.open(SetDateComponent,
      {
        width: '400px', height: '340px', data: {
          title: AdminOpEnum.EMPLZ, subtitle: 'Set date',
          closeWeek: true, cleanDate: true
        },
        disableClose: true
      })
      .afterClosed().subscribe(next => {
      console.log('afterCloseSetDate', next, emp, status);
      this.dialogService.dialog.open(GenericSalesComponent, {
        width: '940px', height: '800px', disableClose: true, data: {
          title: AdminOpEnum.EMPLZ, empl: emp, salesDate: next.date, invoiceStatus: status
        }
      }).afterClosed().subscribe(
        next => {
          console.log('after close emplZ', next);
          if (next && next.receiptNumber) {
            this.reviewCheck(next.receiptNumber);
          }
        }
      );
    });
    // this.dayCloseType('', AdminOpEnum.WTDZ);
  }

  reviewCheck(receiptNumber: string) {
    this.invoiceService.digits = receiptNumber;
    this.operationService.reviewCheck();
  }

  /*showSalesByEmployee1(emp: any) {
    console.log('showSalesByEmployee', emp);
    this.dialogService.dialog.open(GenericSalesComponent,
      {
        width: '700px', height: '680px', disableClose: true, data: {title: AdminOpEnum.EMPLZ, empl: emp }
      });
  }*/

  systemVersion() {
    this.dialogService.openGenericInfo('System Version', environment.version);
  }

  backToUser() {
    console.log('backUser', this.auth.token, this.auth.initialLogin);
    const initUserId = this.auth.initialLogin ? this.auth.initialLogin.user_id : '';
    this.cashService.setOperation(EOperationType.PrevScreen, 'Previous Screen', 'token: ' +
      this.auth.token.user_id + ' - initialToken: ' + initUserId);
    if (this.auth.initialLogin && (this.auth.token.user_id !== this.auth.initialLogin.user_id)) {
      this.auth.restoreInitialLogin();
      this.router.navigateByUrl('/auth/users/loginuser', {replaceUrl: true});
      this.invoiceService.getCashier();
      this.invoiceService.setUser(this.invoiceService.getUserId()).subscribe(
        next => console.log(this.invoiceService.cashier + ' was assigned to the invoice ' + next.receiptNumber),
        error1 => this.dialogService.openGenericInfo(InformationType.ERROR,
          'Can\'t be assigned the user ' + this.invoiceService.cashier + ' to invoice'));
      /* this.auth.logout().subscribe(
        next => {
          this.auth.login(new CredentialsModel(this.auth.initialLogin.username)).subscribe(
            next => this.prevScreen(next),
            error => this.dialogService.openGenericInfo(InformationType.ERROR, error)
          )
        }
      ) */
    } else {
      // this.dialogService.openGenericInfo('Information', 'Any user was logged previously')
      this.router.navigateByUrl('/auth/users/loginuser', {replaceUrl: true});
    }
  }

  prevScreen(loginResp: any) {
    console.log('prevScreen', loginResp);
    // this.auth.restoreInitialLogin();
    this.auth.initialLogin = undefined;
    this.router.navigateByUrl('/auth/users/loginuser', {replaceUrl: true});
    this.invoiceService.getCashier();
    this.invoiceService.setUser(this.invoiceService.getUserId()).subscribe(
      next => console.log(this.invoiceService.cashier + ' was assigned to the invoice ' + next.receiptNumber),
      error1 => this.dialogService.openGenericInfo(InformationType.ERROR,
        'Can\'t be assigned the user ' + this.invoiceService.cashier + ' to invoice'));
  }

  removeAHold() {
    this.operationService.currentOperation = AdminOpEnum.REMOVE_HOLD;
    if (this.invoiceService.invoice!.status !== InvoiceStatus.IN_PROGRESS) {
      if (!this.removeHoldLoaded) {
        this.invoiceService.getInvoiceByStatus(EOperationType.RemoveHold, InvoiceStatus.IN_HOLD)
          .subscribe(next => {
            this.operationService.openDialogInvoices(next, i => this.removeHoldOp(i));
          }, err => this.dialogService.openGenericInfo('Error', 'Can\'t complete remove a hold operation'));
      } else {
        this.removeHoldOp();
      }
    } else {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete remove a hold operation because check is in progress');
    }
  }

  removeHoldOp(i?: Invoice) {
    console.log('removeHold', i);
    if (this.removeHoldLoaded) {
      this.doRemoveHold();
    } else {
      this.invoiceService.setInvoice(i!);
      this.removeHoldLoaded = true;
      this.cashService.removeHoldEnableState();
    }
  }

  doRemoveHold() {
    this.invoiceService.removeHoldOrder(this.invoiceService.invoice!);
    this.removeHoldLoaded = false;
  }

  closeBatch() {
    this.operationService.currentOperation = AdminOpEnum.CLOSE_BATCH;
    this.dialogService.dialog.open(CloseBatchComponent,
      {
        width: '750px', height: '600px', disableClose: true, data: {title: AdminOpEnum.CLOSE_BATCH}
      }).afterClosed().subscribe(
      next => {
        if (next) {
          console.log('closeBatch', next);
          const infoEventDialog = this.dialogService.openGenericInfo(InformationType.INFO, 'Closing batch...',
            null, false, true);
          this.dataStorage.closeBatch(next).subscribe(
            next => {
              console.log('closeBatch', next);
              infoEventDialog!.close();
            }, err => {
              infoEventDialog!.close();
              this.dialogService.openGenericInfo('Error', err);
              this.operationService.currentOperation = '';
            }, () => this.operationService.currentOperation = ''
          );
        } else {
          this.operationService.currentOperation = '';
        }
      });
  }

  closeDay(op: AdminOpEnum, emp?: string) {
    this.dialogService.dialog.open(SetDateComponent,
      {
        width: '400px', height: '340px', data: {title: 'Close Day', subtitle: 'Set date', closeDay: true},
        disableClose: true
      })
      .afterClosed().subscribe(next => {
      console.log('afterCloseSetDate', next);
      if (next.lastClose) {
        this.dayCloseType(emp, op);
      }
      if (next.date) {
        this.dayCloseType(emp, op, next.date);
      }
    });
    // this.dayCloseType('', AdminOpEnum.WTDZ);
  }

  currentDate(date: any): boolean {
    const currentDate = new Intl.DateTimeFormat('sv-SE', {timeZone: 'utc'}).format(new Date());
    const selectedDate = date.from.split(' ')[0];
    console.log('currentDate', currentDate, selectedDate);
    return currentDate === selectedDate;
  }

  dayCloseType(emp?: string, op?: AdminOpEnum, isPrint?: boolean, date?: any) {
    const dayCloseTypes = new Array<any>({value: 1, text: 'Print'}, {value: 2, text: 'Close'});
    if (date && this.currentDate(date)) {
      dayCloseTypes.splice(-1);
    }

    switch (isPrint) {
      case true:
        this.dayClosePrint(emp, op, "Day", date);
        break;
      default:
        this.confirmDayClose(emp, op, "Day", date);
        break;
    }
    /*
    const title = emp ? 'Cashier' : 'Day';
    this.dialogService.dialog.open(DialogDeliveryComponent,
      { width: '600px', height: '340px', data: {name: 'Close Types', label: 'Select a type', arr: dayCloseTypes},
        disableClose: true })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.dayClosePrint(emp, op, title, date);
          break;
        case 2:
          this.confirmDayClose(emp, op, title, date);
          break;
      }
    });
     */
  }

  doDayClose(emp?: string, op?: AdminOpEnum, date?: any) {
    this.cashService.dayCloseEnableState();
    const opTrans = /*this.translate.get(op)['value'];*/ "";
    const dialogEv = this.dialogService.openGenericInfo('Information', 'Closing ' + (emp ? 'cashier' : 'day')
      + '...', undefined, undefined, true);
    const action = emp ? this.dataStorage.cashierClose(true, emp, date) : this.dataStorage.dayClose(true, date);
    action.subscribe(
      next => {
        console.log(op);
        dialogEv!.close();
        this.dialogService.openGenericInfo(emp ? 'Cashier' : 'Day' + ' Close', 'Complete ' + opTrans + ' operation');
      },
      err => {
        dialogEv!.close();
        this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + opTrans + ' operation');
        this.cashService.resetEnableState();
      },
      () => {
        dialogEv!.close();
        this.cashService.resetEnableState();
      }
    );
    this.cashService.resetEnableState();
    this.operationService.resetInactivity(true, 'doDayClose');
  }

  dayClosePrint(emp?: string, op?: AdminOpEnum, title?: string, date?: any) {
    this.cashService.dayCloseEnableState();
    const opTrans = /*this.translate.get(op)['value'];*/ "";
    const dialogEv = this.dialogService.openGenericInfo('Information', 'Printing close ' + (emp ? 'cashier' : 'day')
      + '...', undefined, undefined, true);
    const action = emp ? this.dataStorage.cashierClose(false, emp, date) : this.dataStorage.dayClose(false, date);
    action.subscribe(
      next => {
        console.log(op);
        dialogEv!.close();
        this.dialogService.openGenericInfo(title + ' Close Print', 'Complete ' + opTrans + ' operation');
      },
      err => {
        dialogEv!.close();
        console.error(err);
        this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + opTrans + ' print operation');
        this.cashService.resetEnableState();
      },
      () => {
        dialogEv!.close();
        this.cashService.resetEnableState();
      }
    );
    this.cashService.resetEnableState();
    this.operationService.resetInactivity(true, 'dayClosePrint');
  }

  confirmDayClose(emp?: string, op?: AdminOpEnum, title?: string, date?: any) {
    const opTrans = /*this.translate.get(op)['value'];*/"";
    this.dialogService.openGenericInfo(title + ' Close', 'Do you want close?', '', true)!
      .afterClosed().subscribe(next => {
      console.log('confirmDayClose', next);
      if (next) {
        this.doDayClose(emp, op, date);
      }
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete ' + opTrans + ' operation');
    });
  }

  cashierCloseShift() {
    this.getEmployees(false, (i: any) => {
      console.log('getEmployees', i);
      this.operationService.openDialogWithPag(i, (e) => this.closeDay(AdminOpEnum.CCSZ, e.id), 'Employees',
        'Select a employee:', '', 'userName');
    });
  }

  getEmployees(allUsers: boolean, action: any) {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log('getEmployees', next);
      if (allUsers) {
        next.unshift({id: '-1', userName: 'All employees'});
      }
      action(next);
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t get the employees');
    });
  }

  authPending() {
    this.operationService.currentOperation = AdminOpEnum.AUTH_PENDING;
    if (this.invoiceService.invoice!.status !== InvoiceStatus.IN_PROGRESS) {
      // if(!this.removeHoldLoaded){
      this.dataStorage.getInvoiceByTransferType(EOperationType.AuthPending, ETransferType.Auth)
        .subscribe(next => {
          this.operationService.openDialogInvoices(next, i => this.authPendingOp(i));
        }, err => this.dialogService.openGenericInfo('Error', 'Can\'t complete ' +
          AdminOpEnum.AUTH_PENDING.toLowerCase() + ' operation'));
      /*} else {
        this.removeHoldOp();
      }*/
    } else {
      this.dialogService.openGenericInfo('Error', 'Can\'t complete authorization pending operation because check is in progress');
    }
  }

  authPendingOp(i: Invoice) {
    console.log('authPendentOp', i);
    this.invoiceService.setInvoice(i);
    this.operationService.subTotal();
  }

  setUserToOrder() {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log(AdminOpEnum.SET_USER, next);
      const users = new Array<any>();
      next.map(user => users.push(user));
      this.dialogService.dialog.open(DialogInvoiceComponent,
        {
          width: '780px',
          height: '660px',
          data: {invoice: users, detail: 'userName', title: 'Users', subtitle: 'Select a user'}
          ,
          disableClose: true
        }).afterClosed().subscribe(userSelected => {
        console.log('dialog delivery', userSelected);
        if (userSelected) {
          this.invoiceService.setUser(userSelected['id']).subscribe(
            user => {
              console.log('setUserToOrder', user);
              this.invoiceService.invoice!.applicationUserId = user['applicationUserId'];
              this.dialogService.openGenericInfo('Information', 'The user ' + userSelected['userName']
                + ' was assigned to this invoice');
            },
            err => {
              console.error('setUserToOrder', err);
              this.dialogService.openGenericInfo('Error', 'Can\'t complete set user operation');
            }
          );
        }
      });
    });
  }

  changePrice() {
    console.log('priceCheck');
    /*(this.currentOperation !== AdminOpEnum.CHANGE_PRICES) ? this.currentOperation = AdminOpEnum.CHANGE_PRICES:
      this.currentOperation = "";*/
    this.currentOperation = AdminOpEnum.CHANGE_PRICES;
    if (this.invoiceService.digits) {
      this.doChangePrice();
    } else if (!this.invoiceService.digits && this.cashService.config.sysConfig.changePriceBySelection) {
      this.selectOrScanForChangePrice();
    } else {
      this.scanForChangePrice();
    }
  }

  selectOrScanForChangePrice() {
    const ccTypes = new Array<any>({value: 1, text: 'Select'}, {value: 2, text: 'Scan'});
    this.dialogService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '340px', data: {
          name: 'Change Price Types',
          label: 'Do you want select or scan product to change price', arr: ccTypes
        },
        disableClose: true
      })
      .afterClosed().subscribe(next => {
      console.log(next);
      if (next === 1) {
        this.selectForChangePrice();
      } else if (next === 2) {
        this.scanForChangePrice();
      }
    });
  }

  selectForChangePrice() {
    this.router.navigateByUrl('/home/layout/invoice/departaments', {replaceUrl: true});
    this.operationService.currentOperation = AdminOpEnum.CHANGE_PRICES;
    this.cashService.changePriceEnableState();
  }

  scanForChangePrice() {
    this.operationService.currentOperation = AdminOpEnum.CHANGE_PRICES;
    this.cashService.changePriceScanEnableState();
  }

  doChangePrice() {
    this.invoiceService.getProductByUpc(EOperationType.ChangePrice).subscribe(prods => {
      this.operationService.selectProd(prods).subscribe(prod => {
        if (prod) {
          this.dialogService.openGenericInfo('Change Price', 'Do you want change the price of the ' + prod.name,
            prod.unitCost, true)!
            .afterClosed().subscribe(next => {
            console.log(next);
            if (next !== undefined && next.confirm) {
              this.operationService.changePriceOp(prod);
            } else {
              this.cleanChangePrices();
            }
          });
        } else {
          this.cleanChangePrices();
        }
      });
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t found this product ' +
        this.invoiceService.digits);
      this.cleanChangePrices();
    });
  }

  cleanChangePrices() {
    this.invoiceService.resetDigits();
    this.currentOperation = '';
    this.cashService.resetEnableState();
  }

  /*changePriceOp(prod: Product){
    this.dialogService.dialog.open(ProductGenericComponent,
      {
        width: '480px', height: '650px', data: {name: 'Change Price', label: 'Price', unitCost: prod.unitCost.toFixed(2)},
        disableClose: true
      }).afterClosed().subscribe(
      next => {
        if(next){
          this.invoiceService.updateProductsPrice(prod.upc, next.unitCost, prod.id).subscribe(next => {
              console.log(next);
              this.dialogService.openGenericInfo('Information', 'The price of product '+
                next['upc'] + ' was updated to '+ next['price'].toFixed(2));
            },
            err => {
              this.dialogService.openGenericInfo('Error', 'Can\'t change price of this product '+prod.upc);
            });
        }
      });
  }*/

  splitName(fullname: string, employee: EmployeedModel) {
    const splitFN = fullname.trim().split(' ');
    employee.firstname = splitFN[0];
    if (splitFN.length > 1) {
      employee.lastname = splitFN[splitFN.length - 1];
      employee.username = employee.firstname.substr(0, 3) + employee.lastname;
    } else if (splitFN.length === 1) {
      employee.username = employee.firstname;
    }
    return employee;
  }

  employeeAction() {
    const adTypes = new Array<any>(
      {value: EmployActions.CREATE, text: 'CREATE'}, {value: EmployActions.NAME, text: 'UPDATE NAME'},
      {value: EmployActions.POSITION, text: 'UPDATE POSITION'}, {value: EmployActions.PASS, text: 'UPDATE PASS'},
      {value: EmployActions.CARD, text: 'UPDATE CARD'}, {value: EmployActions.DELETE, text: 'DELETE'});
    this.dialogService.dialog.open(DialogDeliveryComponent,
      {
        width: '600px', height: '360px', data: {name: 'Employees Actions', label: 'Select an action', arr: adTypes},
        disableClose: true
      })
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case EmployActions.CREATE:
          this.employSetup();
          break;
        case EmployActions.PASS:
          this.updatePassword(next);
          break;
        case EmployActions.CARD:
          this.updatePassword(next);
          break;
        case EmployActions.NAME:
          this.updateNamePosition(next);
          break;
        case EmployActions.POSITION:
          this.updateNamePosition(next);
          break;
        case EmployActions.DELETE:
          this.deleteEmploy(next);
          break;
      }
    });
  }

  noShowAdminUser(next: any) {
    return next.splice(next.findIndex((v: any, i: any) => v.userName === 'Admin'), 1);
  }

  updatePassword(action: EmployActions) {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log('getEmployees', next);
      if (this.invoiceService.cashier !== 'Admin') {
        this.noShowAdminUser(next);
      }
      this.operationService.openDialogWithPagObs(next, 'Employees',
        'Select a employee:', '', 'userName').subscribe(
        employee => {
          console.log(employee);
          if (employee) {
            const credential = new CredentialsModel(employee.userName);
            (action === EmployActions.PASS) ? this.getPassword(credential) : this.getPassByCard(credential);
          }
        }
      );
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t get the employees');
    });
  }

  deleteEmploy(action: EmployActions) {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log('getEmployees', next);
      if (this.invoiceService.cashier !== 'Admin') {
        this.noShowAdminUser(next);
      }
      this.operationService.openDialogWithPagObs(next, 'Employees',
        'Select a employee:', '', 'userName').subscribe(
        employee => {
          console.log('deleteEmploy', employee);
          if (employee) {
            this.deleteEmployOp(employee);
          }
        }
      );
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t get the employees');
    });
  }

  updateNamePosition(action: EmployActions) {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log('getEmployees', next);
      if (this.invoiceService.cashier !== 'Admin') {
        this.noShowAdminUser(next);
      }
      this.operationService.openDialogWithPagObs(next, 'Employees',
        'Select a employee:', '', 'userName').subscribe(
        employee => {
          console.log('updateNamePosition', employee);
          if (employee) {
            const credential = new CredentialsModel(employee.userName);
            credential.id = employee.id;
            (action === EmployActions.NAME) ? this.getName(credential) : this.getPosition(credential);
          }
        }
      );
    }, error1 => {
      this.dialogService.openGenericInfo('Error', 'Can\'t get the employees');
    });
  }

  deleteEmployOp(emp: any) {
    this.dataStorage.employDelete(emp.id).subscribe(
      next => {
        console.log(AdminOpEnum.DELETE_ACCOUNT, next);
        this.dialogService.openGenericInfo(InformationType.INFO, 'The employee ' + emp.userName + ' was deleted.');
      },
      err => {
        this.dialogService.openGenericInfo('Error', err);
      }
    );
  }

  getPassword(credential: Credentials) {
    this.operationService.getNumField(AdminOpEnum.EMPLOYEE_SETUP, 'New Password', EFieldType.PASSWORD)
      .subscribe(
        code => {
          if (code) {
            credential.newPassword = code.number;
            this.dataStorage.employUpdatePass(credential).subscribe(
              next => {
                console.log(AdminOpEnum.UPDATE_PASS, next);
                this.dialogService.openGenericInfo(InformationType.INFO, 'The employee ' + next.userName + ' was updated.');
              },
              err => {
                this.dialogService.openGenericInfo('Error', err);
              }
            );
          }
        });
  }

  getPassByCard(credential: Credentials) {
    this.operationService.openSwipeCredentialCard('Password card', 'Swipe password card')
      .subscribe(
        next => {
          console.log('Swipe password card', next);
          console.log('Swipe password userScanned', this.initService.userScanned);
          credential.newPasswordByCard = (next) ? next.pass : this.initService.userScanned;
          this.initService.cleanUserScanned();
          if (credential.newPasswordByCard) {
            this.isAssignedCard(credential);
          }
        }, err => {
          console.error(err);
        }
      );
  }

  isAssignedCard(credential: Credentials, op?: any, arg?: any) {
    this.dataStorage.assignedCard(credential).subscribe(
      exist => exist ?
        this.confirmDeleteCard(credential, op, arg) :
        op ? this.employSetupOp(arg) : this.updateCard(credential),
      err => this.dialogService.openGenericInfo('Error', err)
    )
  }

  confirmDeleteCard(credential: Credentials, op?: any, arg?: any) {
    this.dialogService!.openGenericInfo('', 'This card is used by other employee. ' +
      'If you select Yes you remove the employee with this card.', '', true)!
      .afterClosed().subscribe(next => {
      console.log(next);
      if (next.confirm) {
        op ? this.employSetupOp(arg) : this.updateCard(credential);
      }
    });
  }

  updateCard(credential: Credentials) {
    console.log('Update card', credential);
    this.dataStorage.employUpdatePass(credential)
      .subscribe(
        e => {
          console.log(AdminOpEnum.UPDATE_CARD, e);
          this.dialogService.openGenericInfo(InformationType.INFO, 'The employee ' + e.userName + ' was updated.');
        }, err => this.dialogService.openGenericInfo('Error', err)
      );
  }

  getName(credential: Credentials) {
    this.operationService.getField(AdminOpEnum.EMPLOYEE_SETUP, 'New Name', EFieldType.NAME)
      .subscribe(
        name => {
          console.log('getName', name);
          if (name) {
            credential.username = name.text;
            this.dataStorage.employUpdate(credential).subscribe(
              next => {
                console.log(AdminOpEnum.UPDATE_NAME, next);
                this.dialogService.openGenericInfo(InformationType.INFO, 'The name of employee was updated.');
              },
              err => {
                this.dialogService.openGenericInfo('Error', err);
              }
            );
          }
        });
  }

  getPosition(credential: Credentials) {
    this.getUsersPosition().subscribe(
      positions => {
        console.log(AdminOpEnum.EMPLOYEE_SETUP, positions);
        this.showUsersPosition(<IPositionModel[]>positions).subscribe(positionSelected => {
          console.log('getPosition', positionSelected);
          if (positionSelected) {
            credential.userPositionId = positionSelected.id;
            this.dataStorage.employUpdate(credential).subscribe(
              next => {
                console.log(AdminOpEnum.UPDATE_POSITION, next);
                this.dialogService.openGenericInfo(InformationType.INFO, 'The position of employee was updated.');
              },
              err => {
                this.dialogService.openGenericInfo('Error', err);
              }
            );
          }
        });
      });
  }

  employSetup() {
    let employee = new EmployeedModel();
    this.operationService.getField(AdminOpEnum.EMPLOYEE_SETUP, 'Name', EFieldType.NAME).subscribe(
      name => {
        if (name) {
          employee = this.splitName(name.text, employee);
          this.getUsersPosition().subscribe(
            positions => {
              console.log(AdminOpEnum.EMPLOYEE_SETUP, positions);
              this.showUsersPosition(<IPositionModel[]>positions).subscribe(positionSelected => {
                console.log('dialog delivery', positionSelected);
                if (positionSelected) {
                  employee.userPositionId = positionSelected.id;
                  this.operationService.getNumField(AdminOpEnum.EMPLOYEE_SETUP, 'Password', EFieldType.PASSWORD)
                    .subscribe(
                      code => {
                        if (code) {
                          employee.password = code.number;
                          this.operationService.openSwipeCredentialCard('Password card', 'Swipe password card')
                            .subscribe(
                              next => {
                                console.log('Swipe password card', next);
                                employee.passwordByCard = (next) ? next.pass : this.initService.userScanned;
                                this.initService.cleanUserScanned();
                                employee.companyId = 1;
                                console.log(AdminOpEnum.EMPLOYEE_SETUP, employee);
                                this.dataStorage.employSetup(employee).subscribe(
                                  next => {
                                    console.log(AdminOpEnum.EMPLOYEE_SETUP, next);
                                    this.dialogService.openGenericInfo(InformationType.INFO, 'The employee ' + next.userName + ' was setup.');
                                  },
                                  err => {
                                    this.dialogService.openGenericInfo('Error', err);
                                  }
                                );
                              }, err => {
                                console.error(err);
                              }, () => console.log('complete', this)
                            );
                        } else {
                          this.dialogService.openGenericInfo('Error',
                            'Can\'t setup the employee because no was specified the code');
                        }
                      });
                } else {
                  this.dialogService.openGenericInfo('Error', 'Can\'t setup the employee because no was' +
                    ' selected the position');
                }
              });
            },
            error1 => {
              this.dialogService.openGenericInfo('Error', 'Can\'t get users positions');
            }
          );
        } else {
          this.dialogService.openGenericInfo('Error', 'Can\'t setup the employee because no was' +
            ' selected the name');
        }
      });
  }

  employSetupOp(employee: EmployeedModel) {
    console.log('employSetupOp', employee);
    this.dataStorage.employSetup(employee).subscribe(
      next => {
        console.log(AdminOpEnum.EMPLOYEE_SETUP, next);
        this.dialogService.openGenericInfo(InformationType.INFO, 'The employee ' + next.userName + ' was setup.');
      },
      err => {
        this.dialogService.openGenericInfo('Error', err);
      }
    );
  }

  getUsersPosition(): Observable<any> {
    return this.dataStorage.getUsersPosition();
  }

  showUsersPosition(positions: Array<IPositionModel>) {
    return this.dialogService.dialog.open(DialogInvoiceComponent,
      {
        width: '780px',
        height: '660px',
        data: {invoice: positions, detail: 'name', title: 'Work position', subtitle: 'Select a position'}
        ,
        disableClose: true
      }).afterClosed();
  }

  ebtInquiry() {
    console.log('EBT Inquiry');
    // this.currentOperation = 'EBT Inquiry';
    // if (this.invoiceService.invoice.total !== 0 || this.invoiceService.invoice.fsTotal !== 0) {
    this.invoiceService.ebtInquiry()
      .subscribe(data => {
        console.log(data);
        if (data) {
          this.dialogService.dialog.open(EbtInquiryInfoComponent, {
            width: '360px', height: '320px', disableClose: true, data: {title: AdminOpEnum.EBT_INQUIRY, content: data}
          });
          this.cashService.resetEnableState();
        } else {
          this.dialogService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
          this.cashService.ebtEnableState();
        }
      }, err => {
        console.log(err);
        // this.dialogService.openGenericInfo('Error', 'Can\'t complete ebt inquiry operation');
        this.dialogService.openGenericInfo('Error', err);
        this.cashService.resetEnableState();
      });
    // }
    // this.resetInactivity(false);
  }

  clientSetup() {
    /*
    let client: any;
    this.operationService.getField(AdminOpEnum.CLIENT, 'Name', EFieldType.NAME).subscribe(
      name => {
        if (name) {
          client = new ClientModel(name.text);
          this.operationService.getField(AdminOpEnum.CLIENT, 'Address', EFieldType.ADDRESS).subscribe(
            address => {
              if (address) {
                client.address = address.text;
              }
              this.operationService.getNumField(AdminOpEnum.CLIENT, 'Phone', EFieldType.PHONE).subscribe(
                phone => {
                  if (phone) {
                    client.phone = phone.number;
                  }
                  this.operationService.getField(AdminOpEnum.CLIENT, 'Company', EFieldType.NAME).subscribe(
                    company => {
                      if (company) {
                        client.company = company.text;
                      }
                      this.dataStorage.clientSetup(client).subscribe(
                        next => {
                          console.log(AdminOpEnum.CLIENT, next);
                          this.dialogService.openGenericInfo('Information', 'Client setup operation successful');
                        },
                        err => {
                          this.dialogService.openGenericInfo('Error', 'Cannot setup the client');
                        }
                      );
                    });
                });
            });
        } else {
          this.dialogService.openGenericInfo('Error', 'Cannot setup the client because no was' +
            ' specified the name');
        }
      });
    */
  }

  chargeAccountSetup() {
    /*
    let client: any;
    this.operationService.getField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Name', EFieldType.NAME).subscribe(
      name => {
        if (name) {
          // employee.username = name.text;
          this.operationService.getNumField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Credit Limit', EFieldType.NUMBER)
            .subscribe(
              credit => {
                if (credit) {
                  client = new ClientModel(name.text, credit.number);
                  this.operationService.getField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Address', EFieldType.ADDRESS).subscribe(
                    address => {
                      if (address) {
                        client.address = address.text;
                      }
                      this.operationService.getNumField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Phone', EFieldType.PHONE).subscribe(
                        phone => {
                          if (phone) {
                            client.phone = phone.number;
                          }
                          this.operationService.getField(AdminOpEnum.CHARGE_ACCT_SETUP, 'Company', EFieldType.NAME).subscribe(
                            company => {
                              if (company) {
                                client.company = company.text;
                              }
                              this.dataStorage.clientSetup(client!).subscribe(
                                next => {
                                  console.log(AdminOpEnum.CHARGE_ACCT_SETUP, next);
                                  this.dialogService.openGenericInfo('Information',
                                    'Charge account setup operation successful');
                                },
                                err => {
                                  this.dialogService.openGenericInfo('Error', 'Can\'t setup the charge account');
                                }
                              );
                            });
                        });
                    });
                } else {
                  this.dialogService.openGenericInfo('Error',
                    'Can\'t setup the charge account because no was specified the credit limit');
                }
              });
        } else {
          this.dialogService.openGenericInfo('Error', 'Can\'t setup the charge account because no was' +
            ' specified the name');
        }
      });
     */
  }

  updateCreditLimit() {
    console.log(AdminOpEnum.CREDIT_LIMIT);
    this.currentOperation = AdminOpEnum.CREDIT_LIMIT;
    this.clientService.getClients().subscribe(
      clients => {
        console.log(CustomerOpEnum.ACCT_BALANCE, clients);
        this.operationService.openDialogWithPag(clients, (c) => this.setCreditLimit(c), 'Clients', 'Select a client:',
          '', 'name', 'creditLimit');
      },
      error1 => {
        this.dialogService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');
  }

  giftCard() {
    console.log(AdminOpEnum.GIFT_CARD);
    this.currentOperation = AdminOpEnum.GIFT_CARD;
    this.clientService.getClients().subscribe(
      clients => {
        console.log(this.currentOperation, clients);
        this.operationService.openDialogWithPag(clients, (c) => this.setGiftCard(c), 'Clients',
          'Select a client:', '', 'name', 'giftAmount');
      },
      error1 => {
        this.dialogService.openGenericInfo(InformationType.INFO, 'Can\'t get the clients');
      }, () => this.currentOperation = '');
  }

  setGiftCard(c: any) {
    console.log('setGiftCard', c);
    this.operationService.getPriceField(AdminOpEnum.GIFT_CARD, 'Amount').subscribe(
      amount => {
        console.log('getGiftCard', amount);
        if (amount) {
          this.getGiftCard(c.id, amount.unitCost);
        } else {
          this.dialogService.openGenericInfo(InformationType.INFO,
            'Can\'t set the gift cards because wasn\'t set the amount');
        }
      });
  }

  getGiftCard(c?: string, amount?: number) {
    this.operationService.getNumField(AdminOpEnum.GIFT_CARD, 'Card ID').subscribe(
      card => {
        console.log('getGiftCard', card);
        if (card) {
          this.operationService.openSwipeCredentialCard(AdminOpEnum.GIFT_CARD, 'Swipe card')
            .subscribe(
              next => {
                console.log('Swipe card', next);
                const passwordByCard = (next) ? next.pass : this.initService.userScanned;
                this.initService.cleanUserScanned();
                // Validar si la tarjeta existe o es valida. Guardar tarjeta (cliente y tarjeta)
                this.validGiftCard(c!, new GiftCardModel(card.number, passwordByCard)).subscribe(
                  next => { // En caso de validez invocar finishSetGiftCards
                    this.finishSetGiftCards(c, amount);
                  },
                  error1 => { // sino mostrar error y al cerrar el dialogo invocar finishSetGiftCards
                    this.dialogService.openGenericInfo(InformationType.ERROR, error1)!
                      .afterClosed().subscribe(
                      next => {
                        this.finishSetGiftCards(c, amount);
                      }
                    );
                  });
              }, err => {
                console.error(err);
              }
            );
        } else {
          console.log('getGiftCard', 'no set card');
          this.saveGiftCards(c, amount);
        }
      }
    );
  }

  finishSetGiftCards(c?: string, amount?: number) {
    this.dialogService.openGenericInfo(AdminOpEnum.GIFT_CARD, 'Have you finish to set gift cards?', null,
      true, true)!.afterClosed().subscribe(next => {
      console.log('finishSetGiftCards', next);
      (next && next.confirm) ? this.saveGiftCards(c, amount) : this.getGiftCard(c, amount);
    });
  }

  saveGiftCards(c?: string, amount?: number) {
    console.log('finish set cards', c, amount);
    this.dialogService.openGenericInfo(AdminOpEnum.GIFT_CARD,
      'Do you want to set up the amount?', null, true)!.afterClosed().subscribe(
      next => {
        if (next && next.confirm) {
          this.dataStorage.setGiftCard(new GiftModel(c, amount)).subscribe(
            next => {
              this.dialogService.openGenericInfo(InformationType.INFO,
                'Gift card operation executed successfully');
            },
            error1 => {
              this.dialogService.openGenericInfo(InformationType.ERROR, error1);
            });
        }
      });
  }

  refundSale(receiptNumber?: string) {
    this.dataStorage.refundSale(receiptNumber!).subscribe(
      next => {
        console.log('refundSale', next);
        this.invoiceService.setInvoice(next);
      }, err => this.dialogService.openGenericInfo(InformationType.ERROR, err)
    );
  }

  closeReports() {
    this.operationService.resetInactivity(true);
    const options = [
      {value: 'weekly', text: AdminOpEnum.WEEKLY_REPORT.toString()},
      {value: 'close', text: AdminOpEnum.RANGE_REPORT.toString()},
      {value: 'date', text: AdminOpEnum.DATER_REPORT.toString()}
    ]
    this.dialogService.genericOptionsModal(options, 'Close Reports', 'Select a report type', 600, 320).afterClosed()
      .subscribe(next => {
        next === 'weekly' ? this.weeklyClose() : this.rangeReport(next);
      });
  }

  /*swipeCard(title?: string): Observable<any>{
    this.operationService.openSwipeCredentialCard(title, 'Swipe card')
      .subscribe(
        next => {
          console.log('Swipe card', next);
          let passwordByCard = (next) ? next.pass : this.initService.userScanned;
          this.initService.cleanUserScanned();
          /!*this.dataStorage.employSetup(employee).subscribe(
            next => {
              console.log(AdminOpEnum.EMPLOYEE_SETUP, next);
              this.dialogService.openGenericInfo(InformationType.INFO, 'The employee '+ next.userName +' was setup.')
            },
            err => { this.dialogService.openGenericInfo("Error",err); }
          );*!/
        }, err => { console.error(err)}, () => console.log('complete', this)
      )
  }*/

  weeklyClose() {
    this.cashService.dayCloseEnableState();
    this.weeklyCloseOp(AdminOpEnum.WEEKLY_REPORT);
  }

  weeklyCloseOp(op: any, date?: any) {
    const dialogEv = this.dialogService.openGenericInfo('Information', 'Closing week...');
    this.dataStorage.weeklyClosePrint(undefined, null, date).subscribe(
      next => {
        dialogEv!.close();
        this.dialogService.openGenericInfo(op, 'Completed ' + op.toLowerCase() + ' operation');
      },
      err => {
        dialogEv!.close();
        this.dialogService.openGenericInfo('Error', 'Can\'t complete ' +
          op.toLowerCase() + ' print operation');
        this.cashService.resetEnableState();
      },
      () => {
        this.cashService.resetEnableState();
      }
    );
  }

  rangeReport(type?: 'close' | 'date') {
    this.getDateReport(type).afterClosed().subscribe(next => {
      console.log('afterCloseSetDate', next);
      (next) ? this.getFullCloseReport(next, type) : this.cashService.resetEnableState();
    });
  }

  getDateReport(type: 'close' | 'date' = 'close') {
    return this.dialogService.dialog.open(RangeDateComponent,
      {
        width: '600px', height: '480px', data: {
          title: 'Close Range Report', subtitle: 'Set date', type: type, cleanDate: true
        },
        disableClose: true
      });
  }

  getFullCloseReport(date: { startCloseDate: any, endCloseDate: any }, typeReport?: 'close' | 'date') {
    console.log('getFullReport', date);
    this.operationService.resetInactivity(true);
    const dialogLoading = this.dialogService.openGenericInfo(InformationType.INFO, "Getting close reports...");
    this.dataStorage.getCloseReport(date.startCloseDate, date.endCloseDate).subscribe(
      next => {
        console.log(next);
        dialogLoading!.close();
        const subtitle = typeReport === 'close' ?
          dateFormatter(date.startCloseDate) + '-' + dateFormatter(date.endCloseDate) :
          removeTFromISODate(date.startCloseDate) + '-' + removeTFromISODate(date.endCloseDate);

        this.dialogService.dialog.open(FinancialReportComponent,
          {
            width: '1080px', height: '800px', data: {
              title: 'Financial Report',
              subtitle: subtitle,
              fromDate: date.startCloseDate,
              toDate: date.endCloseDate,
              data: next
            },
            disableClose: true
          }).afterClosed().subscribe(
          next => this.cashService.resetEnableState()
        );
      },
      err => {
        console.error(err);
        dialogLoading!.close();
        this.dialogService.openGenericInfo(InformationType.ERROR, err);
      }
    );
  }

  update() {
    const adTypes = new Array<any>(
      {value: 1, text: 'UPDATE APP'}, {value: 2, text: 'UPDATE PRODUCTS'});
    this.dialogService.genericOptionsModal(adTypes, 'Update Options', undefined, 400, 360)
      .afterClosed().subscribe(next => {
      console.log(next);
      switch (next) {
        case 1:
          this.updateApp();
          break;
        case 2:
          this.updateProducts();
          break;
      }
    });
  }

  updateApp() {
    this.utils.updateBrowser();
  }

  createKeyboradEvent(name: any, key: any, altKey: boolean = false, ctrlKey = false, shitKey = false, metaKey = false, bubbles = true) {
    const keyCode = key === 'F11' ? 122 : key.charCodeAt(0);
    const ev = new KeyboardEvent(name, {
      key: key,
      code: key,
      bubbles: bubbles,
      altKey: altKey,
      ctrlKey: ctrlKey,
      shiftKey: shitKey,
      metaKey: metaKey,
      cancelable: true,
      keyCode: keyCode,
      view: window
    } as KeyboardEventInit);
    return ev;
  }

  timeWorked() {
    this.dataStorage.getApplicationUsers().subscribe(next => {
      console.log(AdminOpEnum.TIME_WORKED, next);
      next.unshift({id: '-1', userName: 'ALL'});
      this.operationService.openDialogWithPag(next, (e) => this.showTimeWorkedByEmployee(e), 'Employees',
        'Select a employee:', '', 'userName');
    }, error1 => {
      this.dialogService.openGenericInfo('Error', error1);
    });
    this.operationService.resetInactivity(true, 'timeWorked');
  }

  showTimeWorkedByEmployee(emp: any) {
    console.log('showSalesByEmployee', emp);
    this.dialogService.dialog.open(SetDateComponent,
      {
        width: '400px', height: '340px', data: {title: 'Time Worked', subtitle: 'Set date', timeWorked: true},
        disableClose: true
      })
      .afterClosed()
      .subscribe(next => {
        console.log('afterCloseSetDate', next);
        if (next) {
          this.dialogService.dialog.open(GenericSalesComponent,
            {
              width: '550px', height: '680px', disableClose: true,
              data: {title: AdminOpEnum.TIME_WORKED, empl: emp, date: next}
            });
        }
      });

  }

  isRefundSale(): boolean {
    return (this.invoiceService.invoice!) ?
      this.invoiceService.invoice!.isRefundSale! : false;
  }

  selectChangeColorPoD() {
    const ccTypes = new Array<any>({value: 1, text: 'Department'}, {value: 2, text: 'Product'});
    this.dialogService.genericOptionsModal(ccTypes, 'Change color to Department or Product',
      'Please select what item you wish to change the color', 600, 340)
      .afterClosed().subscribe(next => {
      console.log(next);
      this.changeColor(next);
    });
  }

  changeColor(itemType: number) {
    if (itemType === 2) {
      (this.invoiceService.digits) ? this.changeProductColor() :
        this.dialogService.openGenericInfo(InformationType.INFO,
          'Please, scan or input a UPC product before select ' + AdminOpEnum.CHANGE_COLOR);
    } else if (itemType === 1) {
      this.changeDeptColor();
    }/* else if (!this.invoiceService.digits && this.cashService.config.sysConfig.changePriceBySelection) {
      this.selectOrScanForChangePrice();
    }  else {
      this.scanForChangePrice();
    }*/
  }

  changeProductColor() {
    this.currentOperation = AdminOpEnum.CHANGE_COLOR;
    this.invoiceService.getProductByUpc(EOperationType.ChangeColor).subscribe(prods => {
      this.operationService.selectProd(prods).subscribe(prod => {
        if (prod) {
          this.doChangeColor(prod);
        } else {
          this.cleanChangePrices();
        }
      });
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t found this product ' +
        this.invoiceService.digits);
      this.cleanChangePrices();
    });
  }

  changeDeptColor() {
    this.cashService.dataStorage.getDepartments().subscribe(depts => {
      this.operationService.openDialogWithPag(depts, dept => this.doChangeColor(dept),
        AdminOpEnum.CHANGE_COLOR, 'Pick a department to change your color', 'name');
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t found departments ');
      this.cleanChangePrices();
    });
  }

  doChangeColor(item: any) {
    this.currentOperation = AdminOpEnum.CHANGE_COLOR;
    const deptColors = ['red', 'yellow'];
    const prodColors = ['blue', 'orange'];
    const colors = ['green', 'violet', 'pink', 'gray', 'brown', 'dark-blue', 'olive', 'magenta', 'gold'];

    if (item) {
      item['upc'] ? colors.push(...prodColors) : colors.push(...deptColors);
      const adTypes = colors.map((v, i) => ({'value': i, 'text': v.toUpperCase(), 'color': v}));
      this.dialogService.dialog.open(DialogDeliveryComponent,
        {
          width: '800px', height: '450px', data: {name: 'Change Color', label: 'Select an option', arr: adTypes},
          disableClose: true
        })
        .afterClosed().subscribe(next => {
        console.log(next);
        if (next !== '') {
          item.color = adTypes[next].color;
          item['upc'] ? this.operationService.changeProductOp(<Product>item) :
            this.operationService.changeProductOp(<Department>item);
        } else {
          this.cleanChangePrices();
        }
      });
    } else {
      this.cleanChangePrices();
    }
  }

  removeTip() {
    this.currentOperation = AdminOpEnum.REMOVE_TIP;
    this.invoiceService.removeTip(EOperationType.RemoveTip).subscribe(inv => {
      if (inv) {
        this.invoiceService.setInvoice(inv);
      }
    }, err => this.dialogService.openGenericInfo(InformationType.ERROR, err));
  }

  createUser(employee: any): Observable<User> {
    return this.adminOperationService.employSetup(baseURL, employee);
  }

  updateUser(employee: any): Observable<User> {
    return this.adminOperationService.employUpdate(baseURL, employee);
  }

  deleteUser(id: string): Observable<User> {
    return this.adminOperationService.employDelete(baseURL, id);
  }

  private setCreditLimit(c: any) {
    this.operationService.getPriceField(AdminOpEnum.CREDIT_LIMIT, 'Amount').subscribe(
      credit => {
        console.log('setCredit', c, credit);
        if (credit) {
          this.dataStorage.updateCreditLimit(c.id, credit.unitCost).subscribe(
            next => {
              console.log('updatedCredit', next);
              this.dialogService.openGenericInfo('Credit Limit', 'The credit limit of client ' + c.name +
                ' is: $' + thousandFormatter(next.creditLimit));
            }, err => this.dialogService.openGenericInfo(InformationType.ERROR, err)
          );
        }
      }
    );
  }

  private validGiftCard(client: string, card: GiftCardModel) {
    return this.dataStorage.validGiftCard(client, card);
  }

  private updateProducts() {
    console.log('update products');
    this.dataStorage.updateProducts().subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      next => this.utils.openGenericInfo(InformationType.INFO,
        'Update products on demand was successfully'),
      error => this.utils.openGenericInfo(InformationType.ERROR, error));
  }

  /* changeColor() {
    this.currentOperation = AdminOpEnum.CHANGE_COLOR;
    if (this.invoiceService.digits) {
      this.doChangeColor();
    } /* else if (!this.invoiceService.digits && this.cashService.config.sysConfig.changePriceBySelection) {
      this.selectOrScanForChangePrice();
    } *//* else {
      this.scanForChangePrice();
    }
  } */

  /* doChangeColor() {
    const colors = ['red', 'blue', 'yellow', 'green', 'violet', 'pink', 'orange'];
    this.invoiceService.getProductByUpc(EOperationType.ChangeColor).subscribe(prods => {
      this.operationService.selectProd(prods).subscribe( prod => {
        if (prod) {
          const adTypes = colors.map((v, i) => { return {"value": i, "text": v.toUpperCase(), "color": v}});
          this.dialogService.dialog.open(DialogDeliveryComponent,
            {
              width: '800px', height: '400px', data: {name: 'Change Color', label: 'Select an option', arr: adTypes},
              disableClose: true
            })
            .afterClosed().subscribe(next => {
              console.log(next);
              if(next !== ""){
                prod.color = adTypes[next].color;
                this.operationService.changeProductOp(prod);
              } else {
                this.cleanChangePrices();
              }
            });
        } else {
          this.cleanChangePrices();
        }
      });
    }, err => {
      this.dialogService.openGenericInfo('Error', 'Can\'t found this product ' +
        this.invoiceService.digits);
      this.cleanChangePrices();
    });
  } */
}
