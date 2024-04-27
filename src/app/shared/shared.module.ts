import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AgGridModule} from 'ag-grid-angular';

import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from '@angular/material/icon';
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from '@angular/material/table';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTabsModule} from "@angular/material/tabs";
import {MatBadgeModule} from "@angular/material/badge";
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";

import {GenericInfoModalComponent} from "./components/generic-info-modal/generic-info-modal.component";
import {ProductGenericComponent} from "@shared/components/product-generic/product-generic.component";
import {AgeValidationComponent} from "@shared/components/age-validation/age-validation.component";
import {DialogPaidoutComponent} from "@shared/containers/dialog-paidout/dialog-paidout.component";
import {DialogLoginComponent} from "@shared/containers/dialog-login/dialog-login.component";
import {LoginComponent} from "@shared/components/login/login.component";
import {FilterComponent} from "@shared/components/filter/filter.component";
import {GenericKeyboardComponent} from "@shared/components/generic-keyboard/generic-keyboard.component";

import {CalculatorComponent} from "@shared/components/calculator/calculator.component";
import {CashOpComponent} from "@shared/components/cash-op/cash-op.component";
import {DialogFilterComponent} from "@shared/containers/dialog-filter/dialog-filter.component";
import {DialogDeliveryComponent} from "@shared/components/dialog-delivery/dialog-delivery.component";
import {DialogInvoiceComponent} from "@shared/components/dialog-invoice/dialog-invoice.component";
import {SwipeCredentialCardComponent} from "@shared/components/swipe-credential-card/swipe-credential-card.component";
import {PaidOutComponent} from "@shared/components/paid-out/paid-out.component";
import {InputCcComponent} from "@shared/components/input-cc/input-cc.component";
import {OperationGroupComponent} from "@shared/components/operation-group/operation-group.component";
import {NumpadComponent} from "@shared/components/numpad/numpad.component";
import {PaginatorComponent} from "@shared/components/paginator/paginator.component";
import {ListInvoicesComponent} from "@shared/components/list-invoices/list-invoices.component";
import {CashPaymentComponent} from "@shared/components/cash-payment/cash-payment.component";
import {OrderInfoComponent} from "@shared/components/order-info/order-info.component";
import {OrderInfoDetailsComponent} from "@shared/components/order-info-details/order-info-details.component";
import {GenericInfoEventsComponent} from "@shared/components/generic-info-events/generic-info-events.component";
import {NgApexchartsModule} from "ng-apexcharts";
import {SidesPrepareComponent} from "@shared/containers/sides-prepare/sides-prepare.component";
import {RangeDateComponent} from "@shared/components/range-date/range-date.component";
import {SetDateComponent} from "@shared/components/set-date/set-date.component";
import {GenericSalesComponent} from "@shared/components/generic-sales/generic-sales.component";
import {FinancialReportComponent} from "@shared/components/financial-report/financial-report.component";
import {SalesShopComponent} from "@shared/components/sales-shop/sales-shop.component";
import {SalesEmplComponent} from "@shared/components/sales-empl/sales-empl.component";
import {TimeWorkedComponent} from "@shared/components/time-worked/time-worked.component";
import {LoadingComponent} from "@shared/components/loading/loading.component";
import {CloseBatchComponent} from "@shared/components/close-batch/close-batch.component";

import {EbtInquiryInfoComponent} from "@shared/components/ebt-inquiry-info/ebt-inquiry-info.component";

import {ApplyDiscountComponent} from "@shared/components/apply-discount/apply-discount.component";
import {NotificationComponent} from './components/notification/notification.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {NgxTouchKeyboardModule} from 'ngx-touch-keyboard';

import {GenericAlertComponent} from "@shared/components/generic-alert/generic-alert.component";
import {AgChartsAngularModule} from "ag-charts-angular";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

const MaterialModule = [
  MatDialogModule,
  MatFormFieldModule,
  MatButtonModule,
  MatAutocompleteModule,
  MatToolbarModule,
  MatIconModule,
  MatBottomSheetModule,
  MatCardModule,
  MatCheckboxModule,
  MatGridListModule,
  MatInputModule,
  MatTableModule,
  MatInputModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatProgressSpinnerModule,
  AgChartsAngularModule,
]

@NgModule({
  declarations: [
    GenericInfoModalComponent,
    ProductGenericComponent,
    AgeValidationComponent,
    DialogPaidoutComponent,
    DialogLoginComponent,
    LoginComponent,
    FilterComponent,
    GenericKeyboardComponent,
    CalculatorComponent,
    CashOpComponent,
    DialogFilterComponent,
    DialogDeliveryComponent,
    DialogInvoiceComponent,
    SwipeCredentialCardComponent,
    PaidOutComponent,
    InputCcComponent,
    OperationGroupComponent,
    NumpadComponent,
    PaginatorComponent,
    ListInvoicesComponent,
    CashPaymentComponent,
    OrderInfoComponent,
    OrderInfoDetailsComponent,
    GenericInfoEventsComponent,
    SidesPrepareComponent,
    RangeDateComponent,
    SetDateComponent,
    GenericSalesComponent,
    FinancialReportComponent,
    SalesShopComponent,
    SalesEmplComponent,
    TimeWorkedComponent,
    LoadingComponent,
    CloseBatchComponent,
    EbtInquiryInfoComponent,
    ApplyDiscountComponent,
    NotificationComponent,
    GenericAlertComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule,
    NgApexchartsModule,
    MatTabsModule,
    MatBadgeModule,
    MatSliderModule,
    MatRadioModule,
    MatSelectModule,
    NgxTouchKeyboardModule,
    AgChartsAngularModule,
    ToastrModule.forRoot(),
  ],
  exports: [MaterialModule, HttpClientModule, AgGridModule,
    AgChartsAngularModule, NgApexchartsModule,
    NgxTouchKeyboardModule, RangeDateComponent
  ],
  providers: [DatePipe, MatDialog]

})
export class SharedModule {
}
