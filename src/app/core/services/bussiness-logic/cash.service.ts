import {EventEmitter, Injectable, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../api/auth.service';
import {DataStorageService} from '../api/data-storage.service';
import {CompanyType} from '../../utils/company-type.enum';
import {AdminOpEnum} from '../../utils/operations/admin-op.enum';
import {UserrolEnum} from '../../utils/userrol.enum';
import {InformationType} from '../../utils/information-type.enum';
import {FinancialOpEnum} from '../../utils/operations';
import {PAXConnTypeEnum} from '../../utils/pax-conn-type.enum';
import {ConfigurationService} from './configuration.service';
import {Observable} from 'rxjs';
import {EOperationType} from '../../utils/operation.type.enum';
import {DialogService} from './dialog.service';
import {EFieldType} from '../../utils/field-type.enum';
import {dataValidation} from '../../utils/functions/functions';
import {Station} from "@models/station.model";
import {DialogFilterComponent} from "@shared/containers/dialog-filter/dialog-filter.component";
import {InputCcComponent} from "@shared/components/input-cc/input-cc.component";
import {ProductGenericComponent} from "@shared/components/product-generic/product-generic.component";
import {CashOpComponent} from "@shared/components/cash-op/cash-op.component";
import {GenericInfoModalComponent} from "@shared/components/generic-info-modal/generic-info-modal.component";
import {DialogDeliveryComponent} from "@shared/components/dialog-delivery/dialog-delivery.component";
import {GenericAlertComponent} from '@shared/components/generic-alert/generic-alert.component';

@Injectable({
  providedIn: 'root'
})
export class CashService {
  disabledInput?: boolean;
  disabledInputKey?: boolean;
  disableStock?: boolean;
  disabledFinOp?: boolean | boolean[];
  disabledInvOp?: boolean | boolean[];
  disabledTotalOp?: boolean | boolean[];
  disabledPayment?: boolean | boolean[];
  disabledPaymentMoney?: boolean | boolean[];
  disabledOtherOp: boolean | boolean[] = false;
  disabledAdminOp: boolean | boolean[] = false;
  disabledAdminFooterOp: boolean | boolean[] = false;
  disabledFinanceAdminOp: boolean | boolean[] = false;
  disabledReportsAdminOp: boolean | boolean[] = false;
  disabledInvoiceAdminOp: boolean | boolean[] = false;
  disabledOtherAdminOp: boolean | boolean[] = false;
  disabledCustomerOp: boolean | boolean[] = false;
  // systemConfig: Configuration;
  noLet4Supervisor = [AdminOpEnum.APPLY_DISCOUNT, AdminOpEnum.REMOVE_HOLD, AdminOpEnum.CHARGE_ACCT_SETUP,
    AdminOpEnum.EMPLOYEE_SETUP, AdminOpEnum.CHANGE_PRICES, AdminOpEnum.CREDIT_LIMIT, AdminOpEnum.WTDZ]
    .map(a => a.toUpperCase());
  stationStatus = new Array<Station>();
  @Output() evReviewEnableState = new EventEmitter<boolean>();
  @Output() evResetEnableState = new EventEmitter<boolean>();
  @Output() evLogout = new EventEmitter<boolean>();
  @Output() evResetStock = new EventEmitter<boolean>();
  station?: Station;
  @Output() evNagivate = new EventEmitter<string>();
  @Output() evSetOrder = new EventEmitter<any>();

  constructor(private dialog: MatDialog, public dataStorage: DataStorageService, public authServ: AuthService,
              private dialogService: DialogService,
              public config: ConfigurationService, private utilsService: DialogService) {
    this.utilsService.evResetEnableState.subscribe(next => this.resetEnableState());
  }

  opDenyByUser(op: AdminOpEnum | FinancialOpEnum, userRol?: UserrolEnum) {
    let opDeny = false;
    // Apply Discount for Supervisor by Configuration
    this.opDenyAllowByConfig(AdminOpEnum.APPLY_DISCOUNT, this.config.sysConfig!.allowApplyDiscount!);
    // Change Prices for Supervisor by Configuration
    this.opDenyAllowByConfig(AdminOpEnum.CHANGE_PRICES, this.config.sysConfig!.allowChangePrice!);

    if (this.authServ.token!.rol === userRol && this.noLet4Supervisor.includes(op)) {
      this.dialogService.openGenericInfo(InformationType.INFO, userRol + ' hasn\'t access to ' + op + ' operation.');
      opDeny = true;
    }
    return opDeny;
  }

  opDenyAllowByConfig(op: AdminOpEnum | FinancialOpEnum, allow: boolean) {
    if (allow) {
      this.noLet4Supervisor.splice(this.noLet4Supervisor.findIndex(v => v === op.toUpperCase()), 1);
    } else {
      if (!this.noLet4Supervisor.includes(op.toUpperCase())) {
        this.noLet4Supervisor.push(op.toUpperCase());
      }
    }
  }

  resetEnableState() {
    console.log('resetEnableState');
    this.disabledInput = this.disabledFinOp = this.disabledInvOp = this.disabledTotalOp = this.disabledAdminOp = false;
    this.disabledPayment = this.disabledPaymentMoney = true;
    this.disabledFinanceAdminOp = false;
    this.disabledReportsAdminOp = false;
    this.disabledInvoiceAdminOp = false;
    this.disabledOtherAdminOp = false;
    this.disabledAdminOp = false;
    this.disabledAdminFooterOp = false;
    this.disableStock = false;
    this.splitAllow(false);
    this.evReviewEnableState.emit(false);
    this.evResetEnableState.emit(true);
  }

  reviewEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disableStock = true;
    this.disabledFinOp = [true, false, true, true, true, true, true, true];
    this.disabledInvOp = [false, true, true, true];
    this.disabledOtherOp = [true, true, true, true, true, false];
    this.disabledReportsAdminOp = true;
    this.disabledFinanceAdminOp = [false, true, true, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledOtherAdminOp = true;
    this.disabledAdminOp = true;
    this.disabledAdminFooterOp = [true, false, true, true];
    this.evReviewEnableState.emit(true);
  }

  getField(title: any, field: any, fieldType?: EFieldType): Observable<any> {
    return this.dialog.open(DialogFilterComponent,
      {
        width: '1024px', height: '600px', disableClose: true, data: {
          title: title + ' - ' + field,
          type: dataValidation(fieldType!)
        }
      }).afterClosed();
  }

  getNumField(name: any, label: any, fieldType?: EFieldType, height = '650'): Observable<any> {
    return this.dialog.open(InputCcComponent,
      {
        width: '480px', height: height + 'px', data: {
          number: '', name: name, label: label,
          type: dataValidation(fieldType!)
        }, disableClose: true
      }).afterClosed();
  }

  getPriceField(name: any, label: any) {
    return this.dialog.open(ProductGenericComponent,
      {
        width: '448px', height: '540px', data: {name: name, label: label, unitCost: 0.00},
        disableClose: true
      }).afterClosed();
  }

  getTotalField(totalToPaid: number) {
    return this.dialog.open(CashOpComponent,
      {
        width: '480px', height: '660px', data: totalToPaid, disableClose: true
      }).afterClosed();
  }

  changePriceEnableState() {
    this.disabledInput = true;
    this.changePriceEnableStateGeneric();
  }

  changePriceScanEnableState() {
    this.disableStock = true;
    this.changePriceEnableStateGeneric();
  }

  changePriceEnableStateGeneric() {
    this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = true;
    this.disabledFinOp = [true, true, true, true, true, true, true, true];
    this.disabledInvOp = [false, true, true, true];
    this.disabledOtherOp = [true, true, true, true, true, false];
    this.disabledReportsAdminOp = true;
    this.disabledFinanceAdminOp = [true, true, true, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledOtherAdminOp = true;
    this.disabledAdminOp = true;
    this.disabledCustomerOp = true;
  }

  reviewPaidEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = true;
    this.disabledFinOp = [true, false, true, true, true, false, false];
    this.disabledInvOp = [false, true, true, true];
  }

  totalsEnableState(fs = false, refund = false) {
    console.log(fs);
    /*this.disabledInput = */
    this.disabledFinOp = this.disabledTotalOp = this.disableStock = true;
    this.disabledInvOp = [false, true, true, true];
    // if(this.config.sysConfig && this.config.sysConfig.allowCardSplit) this.disabledOtherOp = false;
    if (fs) {
      this.disabledPayment = [false, true, true, true, true, true];
    } else if (refund) {
      this.disabledPayment = this.disabledPaymentByCompany();
      this.disabledPaymentMoney = this.disabledPaymentMoneyByCompany();
      this.disabledCustomerOp = false;
    } else {
      // this.disabledPayment = this.disabledPaymentByCompany();
      this.disabledPayment = false;
      this.disabledPaymentMoney = false;
      this.disabledCustomerOp = false;
    }
    this.splitAllow(true);
  }

  totalsDisabled(refund?: boolean, ebt?: boolean) {
    console.log('totalsDisabled', refund, ebt);
    this.disabledFinOp = this.disabledTotalOp = this.disableStock = true;
  }

  disabledPaymentByCompany() {
    return (this.config.sysConfig.companyType === CompanyType.MARKET && this.config.sysConfig.allowEBT) ?
      [true, true, true, false, false, true] : [true, true, false, false, true, true];
  }

  disabledPaymentMoneyByCompany() {
    return (this.config.sysConfig.companyType === CompanyType.MARKET) ? [true, true, true, true, true, true, true, true] : true;
  }

  ebtEnableState() {
    this.disabledTotalOp = [true, false];
    this.disabledPayment = this.disabledPaymentMoney = true;
  }

  cancelCheckEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disableStock = true;
    // this.disabledInvOp =[false, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledReportsAdminOp = true;
    this.disabledAdminOp = [true, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true];
    // this.evReviewEnableState.emit(true);
  }

  removeHoldEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disableStock = true;
    // this.disabledInvOp =[false, true, true, true];
    this.disabledInvoiceAdminOp = [true, false];
    this.disabledReportsAdminOp = true;
    this.disabledAdminOp = [true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true];
    // this.evReviewEnableState.emit(true);
  }

  dayCloseEnableState() {
    this.disabledInput = this.disabledTotalOp = this.disabledPayment = this.disabledPaymentMoney = this.disabledFinOp =
      this.disabledAdminOp = this.disableStock = true;
    this.disabledInvOp = [false, true, true, true];
  }


  getSystemConfig() {
    return this.dataStorage.getConfiguration();
  }

  getOrder(inv: string) {
    return this.dataStorage.getOrder(inv);
  }

  openDialogs() {
    return (this.dialog.openDialogs && this.dialog.openDialogs.length);
  }

  setOperation(typeOp: EOperationType, entity: string, desc: string) {
    this.dataStorage.registryOperation({operationType: typeOp, entityName: entity, description: desc}).subscribe(
      next => console.log('OperationService.setOperation', next),
      error1 => console.error('OperationService.setOperation', error1)
    );
  }

  private splitAllow(enabled?: boolean) {
    if (this.config.sysConfig && (this.config.sysConfig.allowCardSplit &&
      this.config.sysConfig.paxConnType === PAXConnTypeEnum.ONLINE)) {
      this.disabledCustomerOp = !enabled ? [true, false, false, true] : false;
    } else if (this.config.sysConfig && (!this.config.sysConfig.allowCardSplit ||
      this.config.sysConfig.paxConnType !== PAXConnTypeEnum.ONLINE)) {
      this.disabledCustomerOp = !enabled ? [false, false, true] : false;
    } else {
      console.log('splitAllow', this.config.sysConfig, this.disabledCustomerOp);
    }
  }
}
