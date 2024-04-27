import {Component} from '@angular/core';
import {AuthService} from '@core/services/api/auth.service';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {ConfigurationService} from '@core/services/bussiness-logic/configuration.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {Configuration} from '@models/configuration.model';
import {DialogConfirm, DialogType} from '@core/utils/dialog-type.enum';


@Component({
  selector: 'app-settings-other-permissions-option',
  templateUrl: './settings-other-permissions-option.component.html',
  styleUrl: './settings-other-permissions-option.component.css'
})
export class SettingsOtherPermissionsOptionComponent {
  public newConfig!: Configuration;

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


  public change_allowAddProdGen() {
    this.newConfig.allowAddProdGen = !this.newConfig.allowAddProdGen;
  }

  public change_allowPromotion() {
    this.newConfig.allowPromotion = !this.newConfig.allowPromotion;
  }

  public change_allowClock() {
    this.newConfig.allowClock = !this.newConfig.allowClock;
  }

  public change_allowClientUpdate() {
    this.newConfig.allowClientUpdate = !this.newConfig.allowClientUpdate;
  }

  public change_closeAuth() {
    this.newConfig.closeAuth = !this.newConfig.closeAuth;
  }

  public change_allowEBT() {
    this.newConfig.allowEBT = !this.newConfig.allowEBT;
  }

  public change_allowLastProdClear() {
    this.newConfig.allowLastProdClear = !this.newConfig.allowLastProdClear;
  }

  public change_closeDayAutomatic() {
    this.newConfig.closeDayAutomatic = !this.newConfig.closeDayAutomatic;
  }

  public change_restartDayAutomatic() {
    this.newConfig.restartDayAutomatic = !this.newConfig.restartDayAutomatic;
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
