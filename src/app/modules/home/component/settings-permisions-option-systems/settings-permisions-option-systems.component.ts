import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/services/api/auth.service';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {ConfigurationService} from '@core/services/bussiness-logic/configuration.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {Configuration} from '@models/configuration.model';
import {DialogConfirm, DialogType} from '@core/utils/dialog-type.enum';

@Component({
  selector: 'app-settings-permisions-option-systems',
  templateUrl: './settings-permisions-option-systems.component.html',
  styleUrl: './settings-permisions-option-systems.component.css',
})
export class SettingsPermisionsOptionSystemsComponent implements OnInit {
  public newConfig: Configuration = {};

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private dataStore: DataStorageService,
    private configServices: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.newConfig = this.configServices.sysConfig;
  }


  public changeCloseDay() {
    this.newConfig.closeDayAutomatic = !this.newConfig.closeDayAutomatic;
  }

  public changePrintVoid() {
    this.newConfig.printVoid = !this.newConfig.printVoid;
  }

  public changePrintHold() {
    this.newConfig.printHold = !this.newConfig.printHold;
  }

  public changeInitTicket() {
    this.newConfig.printInitTicket = !this.newConfig.printInitTicket;
  }

  public changePrintTicket() {
    this.newConfig.printTicket = !this.newConfig.printTicket;
  }

  public changePrintMerchantTicket() {
    this.newConfig.printMerchantTicket = !this.newConfig.printMerchantTicket;
  }

  public changeAllowCardSplit() {
    this.newConfig.allowCardSplit = !this.newConfig.allowCardSplit;
  }

  public changeAllowGiftCard() {
    this.newConfig.allowGiftCard = !this.newConfig.allowGiftCard;
  }

  public changeAllowApllyDiscount() {
    this.newConfig.allowApplyDiscount = !this.newConfig.allowApplyDiscount;
  }

  public changeChangePrice() {
    this.newConfig.allowChangePrice = !this.newConfig.allowChangePrice;
  }

  public changeChangeSelectPrice() {
    this.newConfig.changePriceBySelection = !this.newConfig.changePriceBySelection;
  }

  public changeDebitAsCreditCard() {
    this.newConfig.debitAsCreditCard = !this.newConfig.debitAsCreditCard;
  }


  public onSaveSetting() {
    /*const settings: Configuration = {
      closeDayAutomatic: this.closeDayAutomatic,
      printVoid:  this.printVoid,
      printHold: this.printHold,
      printInitTicket: this.printInitTicket,
      printTicket: this.printTicket,
      printMerchantTicket: this.printMerchantTicket,
      allowCardSplit: this.allowCardSplit,
      allowGiftCard: this.allowGiftCard,
      allowApplyDiscount: this.allowApplyDiscount,
      allowChangePrice: this.allowChangePrice,
      changePriceBySelection: this.changePriceBySelection,
      debitAsCreditCard: this.debitAsCreditCard,

    };*/

    this.configServices.setConfig(this.newConfig).subscribe(
      (next) => {
        this.dialogService.openGenericAlert(
          DialogType.DT_SUCCESS,
          'Success !',
          'Settings updated correctly',
          null,
          DialogConfirm.BTN_CLOSE
        );
      },
      (error1) => {
        this.dialogService.openGenericAlert(
          DialogType.DT_ERROR,
          'Error !',
          'Settings updated was wrong',
          null,
          DialogConfirm.BTN_CLOSE
        );
      }
    );
  }
}
