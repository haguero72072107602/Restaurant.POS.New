import {Injectable} from '@angular/core';
import {PAXConnTypeEnum} from '../../utils/pax-conn-type.enum';
import {BreakTextEnum} from '../../utils/breaktext.enum';
import {DataStorageService} from '../api/data-storage.service';
import {MatDialog} from '@angular/material/dialog';
import {reloadBrowser} from '../../utils/functions/functions';
import {Configuration} from "@models/configuration.model";
import {GenericInfoModalComponent} from "@shared/components/generic-info-modal/generic-info-modal.component";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  sysConfig!: Configuration;

  constructor(private dataStore: DataStorageService,
              private dialog: MatDialog,
              private dialogService: DialogService,
              private router: Router
  ) {
  }

  load(): Promise<any> {
    return this.getConfig().toPromise().then(next => {
      console.log('getConfig successfull', next);
      this.setSystemConfig(next);
    }, err => {

      console.error('getConfig failed', err);

      setInterval(() => {
        reloadBrowser();
      }, 20000)

      /*
      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION,
        "Question",
        'Can\'t get configuration. Do you want reload configuration?',
        undefined, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe(
        next => {
          console.log(next);
          reloadBrowser();
          if (next.confirm) {
            reloadBrowser();
          } else {
            reloadBrowser();
          }
        }
      );
      */

    });
  }

  setSystemConfig(conf: any) {
    if (!conf.paxTimeout) {
      conf.paxTimeout = 180;
    }
    if (!conf.paxConnType) {
      conf.paxConnType = PAXConnTypeEnum.OFFLINE;
    }
    if (!conf.inactivityTime) {
      conf.inactivityTime = 60;
    }
    if (!conf.breakText) {
      conf.breakText = BreakTextEnum.ALL;
    }
    if (conf.allowMarketCafeteria === undefined) {
      conf.allowMarketCafeteria = true;
    }
    this.sysConfig = conf;
  }

  getConfig() {
    return this.dataStore.getConfiguration();
  }

  setConfig(conf: Configuration) {
    return this.dataStore.setConfiguration(conf);
  }

}
