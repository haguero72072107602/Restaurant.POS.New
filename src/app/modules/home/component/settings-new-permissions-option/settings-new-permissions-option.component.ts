import {Component} from '@angular/core';
import {AuthService} from '@core/services/api/auth.service';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {ConfigurationService} from '@core/services/bussiness-logic/configuration.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {Configuration} from '@models/configuration.model';
import {DialogConfirm, DialogType} from '@core/utils/dialog-type.enum';


@Component({
  selector: 'app-settings-new-permissions-option',
  templateUrl: './settings-new-permissions-option.component.html',
  styleUrl: './settings-new-permissions-option.component.css'
})
export class SettingsNewPermissionsOptionComponent {
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


  public change_allowPayment() {
    this.newConfig.allowPayment = !this.newConfig.allowPayment;
  }

  public change_allowUserPrepareOrder() {
    this.newConfig.allowUserPrepareOrder = !this.newConfig.allowUserPrepareOrder;
  }

  public change_prepareOrderToHoldInvoice() {
    this.newConfig.prepareOrderToHoldInvoice = !this.newConfig.prepareOrderToHoldInvoice;
  }

  public change_printDefaultAggregates() {
    this.newConfig.printDefaultAggregates = !this.newConfig.printDefaultAggregates;
  }

  public change_removeTax() {
    this.newConfig.removeTax = !this.newConfig.removeTax;
  }

  public change_allowMarketCafeteria() {
    this.newConfig.allowMarketCafeteria = !this.newConfig.allowMarketCafeteria;
  }

  public change_printTicketInProgress() {
    this.newConfig.printTicketInProgress = !this.newConfig.printTicketInProgress;
  }

  public change_allowRetailInRestaurant() {
    this.newConfig.allowRetailInRestaurant = !this.newConfig.allowRetailInRestaurant;
  }

  public changeAllowTip() {
    this.newConfig.allowTip = !this.newConfig.allowTip;
  }

  public change_allowAuth() {
    this.newConfig.allowAuth = !this.newConfig.allowAuth;
  }


  public onSaveSetting() {


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
