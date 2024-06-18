import {APP_INITIALIZER, Injectable, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from "@shared/shared.module";
import {InitModule} from "@modules/init/init.module";
import {AuthInterceptor} from "@core/interceptors/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {baseURL} from "@core/utils/url.path.enum";

import {Theme} from "@models/theme";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {register} from 'swiper/element/bundle';

import * as Hammer from 'hammerjs';
import {
  HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG
}
  from '@angular/platform-browser';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

// register Swiper custom elements
register();


export function onInitialize(departProdService: DepartProductService) {
  return () => {
    departProdService.loadData();
  }
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  override = <any>{
    swipe: {direction: Hammer.DIRECTION_ALL},
  };
}


export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  //return new TranslateHttpLoader(http, 'assets/resources/');
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    SharedModule,
    InitModule,
    HammerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }
    })
  ],
  providers: [
    Theme,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: 'BaseURL', useValue: baseURL},
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS},
    {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}
  ],
  bootstrap: [AppComponent],

})
export class AppModule {
}
