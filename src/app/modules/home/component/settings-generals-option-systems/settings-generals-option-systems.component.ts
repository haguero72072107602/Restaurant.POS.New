import {Component, OnInit} from '@angular/core';
import {AuthService} from '@core/services/api/auth.service';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {ConfigurationService} from '@core/services/bussiness-logic/configuration.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {BreakTextEnum} from '@core/utils/breaktext.enum';
import {CompanyType} from '@core/utils/company-type.enum';
import {DialogConfirm, DialogType} from '@core/utils/dialog-type.enum';
import {LangType} from '@core/utils/laguage-type.enum';
import {PAXConnTypeEnum} from '@core/utils/pax-conn-type.enum';
import {Configuration} from '@models/configuration.model';

@Component({
  selector: 'app-settings-generals-option-systems',
  templateUrl: './settings-generals-option-systems.component.html',
  styleUrls: ['./settings-generals-option-systems.component.css'],
})
export class SettingsGeneralsOptionSystemsComponent implements OnInit {
  public newConfig: Configuration = {};
  public timeLogout_Options = [
    {
      title: '30 min',
      value: 30,
    },
    {
      title: '60 min',
      value: 60,
    },
    {
      title: '2 horas',
      value: 120,
    },
    {
      title: '3 horas',
      value: 180,
    },
    {
      title: '4 horas',
      value: 240,
    },
  ];
  public bussiness_type_Options = [
    {
      title: 'Restaurant',
      value: CompanyType.RESTAURANT,
    },
    {
      title: 'Bar',
      value: CompanyType.BAR,
    },
    {
      title: 'Cafeteria',
      value: CompanyType.CAFETERIA,
    },
    {
      title: 'Islands',
      value: CompanyType.ISLANDS,
    },
    {
      title: 'Market',
      value: CompanyType.MARKET,
    },
    {
      title: 'Market cafet',
      value: CompanyType.MARKET_CAFET,
    },
  ];
  public language_Options = [
    {
      title: 'English',
      value: LangType.EN,
    },
    {
      title: 'Spanish',
      value: LangType.ES,
    },
  ];
  public limitSlides_Options = [
    {
      title: '3',
      value: 3,
    },
    {
      title: '5',
      value: 5,
    },
  ];
  public debounceTimeScanner_Options = [
    {
      title: '----',
      value: 0,
    },
    {
      title: '5 sec',
      value: 5,
    },
    {
      title: '10 sec',
      value: 10,
    },
  ];
  public themes_Options = [
    {
      title: 'Blue (Default)',
      value: 'blueTheme',
    },
    {
      title: 'Light',
      value: 'light',
    },
    {
      title: 'Dark',
      value: 'dark',
    },
  ];

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

  public onChangeTimeLogout($event: any) {
    this.newConfig.inactivityTime = $event.target.value;
  }

  public onChangeBussinessType($event: any) {
    this.newConfig.companyType = $event.target.value;
  }

  public onChangeLanguage($event: any) {
    this.newConfig.language = $event.target.value;
  }

  public onChangeLimitSlides($event: any) {
    this.newConfig.limitSides = $event.target.value;
  }

  public onChangeDebounceTime($event: any) {
    this.newConfig.debounceTime = $event.target.value;
  }

  public onChangeTheme($event: any) {
    this.newConfig.themes = $event.target.value;
  }

  public changePaxOnline() {
    if (this.newConfig.paxConnType == PAXConnTypeEnum.ONLINE) {
      this.newConfig.paxConnType = PAXConnTypeEnum.OFFLINE
    } else {
      this.newConfig.paxConnType = PAXConnTypeEnum.ONLINE
    }

  }

  public changeExternalScale() {
    this.newConfig.externalScale = !this.newConfig.externalScale;
  }

  public changeFullRefund() {
    this.newConfig.fullRefund = !this.newConfig.fullRefund;
  }

  public changeBreakProduct() {
    if (this.newConfig.breakText == BreakTextEnum.ALL) {
      this.newConfig.breakText = BreakTextEnum.WORD
    } else {
      this.newConfig.breakText = BreakTextEnum.ALL
    }

  }

  public changeCloseReturn() {
    this.newConfig.closeDayAutomatic = !this.newConfig.closeDayAutomatic;
  }


  public onSaveSetting() {
    /* const settings: any = {
       inactivityTime: Number(this.inactivityTime),
       language: this.language,
       debounceTime: this.debounceTime,
       themes: this.themes,
       limitSides: this.limitSides,
       externalScale: this.externalScale,
       fullRefund: this.fullRefund,
       closeDayAutomatic: this.closeDayAutomatic,
       paxConnType: this.paxConnType
         ? PAXConnTypeEnum.ONLINE
         : PAXConnTypeEnum.OFFLINE,
       posNumber: 0,
       allowClear: true,
       allowAddMiscellany: true,
       showTicketLogo: true,
       showTicketFooter: true,
       authorizationPreTotal: 0,
       companyType: 1,
       companyId: 1,
       allowCardSplit: true,
       allowEBT: true,
       paxTimeout: 0,
       allowAddProdGen: true,
       closeChange: true,
       allowGiftCard: true,
       allowPromotion: true,
       allowLastProdClear: true,
       allowFoodStampMark: true,
       allowAdminAsCashier: true,
       allowApplyDiscount: true,
       allowChangePrice: true,
       allowClock: true,
       changePriceBySelection: true,
       closeAuth: true,
       printVoid: true,
       printHold: true,
       printMerchantTicket: true,
       printTicket: true,
       printInitTicket: true,
       debitAsCreditCard: true,
       printCloseDayAutomatic: true,
       closeBatchAutomatic: true,
       restartDayAutomatic: true,
       sendFinancialEmail: true,
       printPaymentTicket: true,
       allowClientUpdate: true,
       dailyRprtAsGrid: true,
       printCloseBatchTicket: true,
       allowMarketCafeteria: true,
       sendDirectToPrinter: true,
       allowPayment: true,
       allowUserPrepareOrder: true,
       printDefaultAggregates: true,
       prepareOrderToHoldInvoice: true,
       allowTip: true,
       removeTax: true,
       allowAuth: true,
       addUserToHold: true,
       applyMerchantFee: true,
       percentMerchantFee: 0,
       allowRetailInRestaurant: true,
       printFinancialOnlyByOwner: true,
       tipWithoutAuth: true,
       allowDineIn: true,
       allowPickUp: true,
       allowDelivery: true,
       allowToGo: true,
       allowOpenPriceNote: true,
       sidesFree: 0,
     };
 */


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
