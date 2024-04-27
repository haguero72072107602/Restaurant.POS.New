import {APP_INITIALIZER, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from "@angular/common/http";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
//import {TranslateHttpLoader} from "@ngx-translate/http-loader";
//import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

export function onInitialize(configService: ConfigurationService, departProdService: DepartProductService) {
  return () => {
    configService.load();
  }
}

// required for AOT compilation
/*
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
*/


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    /*
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
    */
  ],
  providers: [
    ConfigurationService,
    {
      provide: APP_INITIALIZER, useFactory: onInitialize, deps: [ConfigurationService], multi: true
    }
  ],
  exports: [/*, TranslateModule*/]
})
export class InitModule {
}
