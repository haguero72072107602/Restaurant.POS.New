import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxDaterangepickerMd} from 'ngx-daterangepicker-material';

import {HomeRoutingModule} from './home-routing.module';
import {LayoutComponent} from '@modules/home/component/layout/layout.component';
import {InvoiceComponent} from './containers/invoice/invoice.component';
import {PayComponent} from './containers/pay/pay.component';
import {HeaderComponent} from './component/header/header.component';
import {SidebarComponent} from './component/sidebar/sidebar.component';
import {SettingsComponent} from './containers/settings/settings.component';
import {ReportsComponent} from './containers/reports/reports.component';
import {OrdersComponent} from './containers/orders/orders.component';
import {
  CardItemsOrderComponent
} from '@modules/home/component/invoice-cart/card-items-order/card-items-order.component';
import {SharedModule} from '@shared/shared.module';
import {CategoryComponent} from '@modules/home/component/list-category/category.component';
import {CardCategoryComponent} from '@modules/home/component/list-category/card-category/card-category.component';
import {InvoiceCartComponent} from './component/invoice-cart/invoice-cart.component';
import {PayOrderComponent} from './component/pay-order/pay-order.component';
import {ListOrderComponent} from './component/list-order/list-order.component';
import {CalculatorComponent} from './component/calculator/calculator.component';
import {InfoPayOrderComponent} from './component/info-pay-order/info-pay-order.component';
import {
  AddUpdateProductOrderComponent
} from "@modules/home/component/add-update-product-order/add-update-product-order.component";

import {DragDropModule} from "@angular/cdk/drag-drop";
import {CoreModule} from "@core/core.module";
import {TableCellRender} from './component/table-cell-render/table-cell-render';
import {ButtonsCellRender} from '@modules/home/component/list-order/buttons-cell-render/buttons-cell-render';
import {TestingComponent} from "@modules/home/containers/testing/testing.component";
import {RptResumenOperationComponent} from './component/rpt-resumen-operation/rpt-resumen-operation.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {RptBlackComponent} from './component/rpt-black/rpt-black.component';
import {BadgeCellRender} from './component/badge-cell-render/badge-cell-render';

import {AgGridModule} from 'ag-grid-angular';
import {CustomersComponent} from './containers/customers/customers.component';
import {TablesComponent} from './containers/tables/tables.component';
import {ListTablesComponent} from './component/list-tables/list-tables.component';
import {CardTableComponent} from '@modules/home/component/list-tables/card-table/card-table.component';
import {AddCardTableComponent} from './component/add-card-table/add-card-table.component';
import {CardInvoiceComponent} from './component/card-invoice/card-invoice.component';
import {AssignTableComponent} from './component/assign-table/assign-table.component';
import {AddTableComponent} from './component/add-table/add-table.component';
import {ScrollTableComponent} from '@modules/home/component/invoice-cart/scroll-table/scroll-table.component';
import {DlgSplitComponent} from './component/dlg-split/dlg-split.component';
import {CardSplitComponent} from './component/card-split/card-split.component';
import {CardArrSplitComponent} from './component/card-arr-split/card-arr-split.component';
import {RptSalesDaysComponent} from './component/rpt-sales-days/rpt-sales-days.component';
import {AddNoteComponent} from './component/add-note/add-note.component';
import {NgxTouchKeyboardModule} from 'ngx-touch-keyboard';
import {CalculatorTipComponent} from "@modules/home/component/calculator-tip/calculator-tip.component";
import {RptCloseDayComponent} from "@modules/home/component/rpt-close-day/rpt-close-day.component";
import {OverlayModule} from '@angular/cdk/overlay';
import {AddCodeComponent} from './component/add-code/add-code.component';
import {AddNoteDueComponent} from "@modules/home/component/add-note-due/add-note-due.component";
import {ViewInvoiceComponent} from './component/view-invoice/view-invoice.component';
import {ButtonsCloseDay} from './component/buttons-closeday/buttons-closeday';
import {CardDateComponent} from './component/card-date/card-date.component';
import {OverlayComponent} from "@modules/home/component/overlay/overlay.component";
import {RptClockShiftComponent} from "@modules/home/component/rpt-clock-shift/rpt-clock-shift.component";
import {CardReadmeComponent} from './component/card-readme/card-readme.component';
import {CalculatorDiscountComponent} from "@modules/home/component/calculator-discount/calculator-discount.component";
import {CalculatorCashOutInComponent} from './component/calculator-cash-out-in/calculator-cash-out-in.component';
import {CalculatorAdjustComponent} from './component/calculator-adjust/calculator-adjust.component';
import {ListUserComponent} from "@modules/home/component/list-user/list-user.component";
import {CalculatorTipCashComponent} from "@modules/home/component/calculator-tip-cash/calculator-tip-cash.component";
import {CardAdjustComponent} from './component/card-adjust/card-adjust.component';
import {CardCalculatorComponent} from './component/card-calculator/card-calculator.component';
import {RptCloseBatchComponent} from './component/rpt-close-batch/rpt-close-batch.component';
import {DlgClosebatchComponent} from './component/dlg-closebatch/dlg-closebatch.component';
import {InvPictureRender} from "@modules/home/component/inv-picture-render/inv-picture-render.component";
import {ButtonsMenuRender} from "@modules/home/component/list-menu/buttons-menu-render/buttons-menu-render.component";
import {DlgDiscountComponent} from './component/dlg-discount/dlg-discount.component';
import {SettingsGeneralsComponent} from './component/settings-generals/settings-generals.component';
import {HaveKeycardComponent} from "@modules/home/component/have-keycard/have-keycard.component";
import {UpdateUserComponent} from "@modules/home/component/list-user/update-user/update-user.component";
import {ButtonsTable} from "@modules/home/component/list-user/buttons-table/buttons-table";
import {InventoryComponent} from "@modules/home/containers/Inventory/inventory.component";
import {
  CardComponentEditComponent
} from "@modules/home/component/list-menu/card-component-edit/card-component-edit.component";
import {ComponentEditComponent} from "@modules/home/component/list-components/component-edit/component-edit.component";
import {
  CardModiferGroupComponent
} from "@modules/home/component/list-modifiers-group/card-modifer-group/card-modifer-group.component";
import {
  DropdownModifierGroupComponent
} from "@modules/home/component/list-modifiers-group/dropdown-modifier-group/dropdown-modifier-group.component";
import {
  DropdownElementModifierGroupComponent
} from "@modules/home/component/list-modifiers-group/dropdown-element-modifier-group/dropdown-element-modifier-group.component";
import {
  CardElementModifierGroupComponent
} from "@modules/home/component/card-element-modifier-group/card-element-modifier-group.component";
import {DropdownDepartmentComponent} from "@modules/home/component/dropdown-department/dropdown-department.component";
import {
  BlockRptSalesRevenueComponent
} from "@modules/home/component/block-rpt-sales-revenue/block-rpt-sales-revenue.component";
import {RptMenuItemsSalesComponent} from "@modules/home/component/rpt-menu-items-sales/rpt-menu-items-sales.component";
import {RptSalesRevenueComponent} from "@modules/home/component/rpt-sales-revenue/rpt-sales-revenue.component";
import {
  BlockRptMenuItemsBestsellerComponent
} from "@modules/home/component/block-rpt-menu-items-bestseller/block-rpt-menu-items-bestseller.component";
import {
  SettingsGeneralsOptionSystemsComponent
} from "@modules/home/component/settings-generals/settings-generals-option-systems/settings-generals-option-systems.component";
import {
  SettingsPermisionsOptionSystemsComponent
} from "@modules/home/component/settings-generals/settings-permisions-option-systems/settings-permisions-option-systems.component";
import {
  SettingsNewPermissionsOptionComponent
} from "@modules/home/component/settings-generals/settings-new-permissions-option/settings-new-permissions-option.component";
import {
  SettingsOtherPermissionsOptionComponent
} from "@modules/home/component/settings-generals/settings-other-permissions-option/settings-other-permissions-option.component";
import {SliderComponent} from "@modules/home/component/slider/slider.component";
import {SliderPhotoComponent} from "@modules/home/component/slider-photo/slider-photo.component";
import {SafeUrlPipe} from "@core/pipe/safeUrl.pipe";
import {ProgressCircleComponent} from "@modules/home/component/progress-circle/progress-circle.component";
import {SchedulerCardComponent} from "@modules/home/component/list-scheduler/scheduler-card/scheduler-card.component";
import {DateRangeComponent} from "@modules/home/component/daterange/daterange.component";
import {FormDateRangeComponent} from "@modules/home/component/form-date-range/form-date-range.component";
import {SelectTableComponent} from "@modules/home/component/list-order/select-table/select-table.component";
import {ButtonDateRangeComponent} from "@modules/home/component/button-date-range/button-date-range.component";
import {PortalModule} from "@angular/cdk/portal";
import {ScrollEarringComponent} from "@modules/home/component/scroll-earring/scroll-earring.component";
import {ScrollButtonsComponent} from "@modules/home/component/list-products/scroll-buttons/scroll-buttons.component";

@NgModule({
  declarations: [
    LayoutComponent,
    InvoiceComponent,
    PayComponent,
    HeaderComponent,
    SidebarComponent,
    SettingsComponent,
    ReportsComponent,
    OrdersComponent,
    CardItemsOrderComponent,
    CategoryComponent,
    InvoiceCartComponent,
    PayOrderComponent,
    CalculatorComponent,
    InfoPayOrderComponent,
    AddUpdateProductOrderComponent,

    TestingComponent,

    TableCellRender,
    ButtonsCellRender,
    RptResumenOperationComponent,
    RptBlackComponent,
    //RptFinancialComponent,
    BadgeCellRender,
    CustomersComponent,
    TablesComponent,
    ListTablesComponent,
    CardTableComponent,
    AddCardTableComponent,
    CardInvoiceComponent,
    AssignTableComponent,
    AddTableComponent,
    ScrollTableComponent,
    DlgSplitComponent,
    CardSplitComponent,
    CardArrSplitComponent,
    RptSalesDaysComponent,
    AddNoteComponent,
    CalculatorTipComponent,
    RptCloseDayComponent,
    AddCodeComponent,
    AddNoteDueComponent,
    PayOrderComponent,
    ViewInvoiceComponent,
    ButtonsCloseDay,
    CardDateComponent,
    OverlayComponent,
    RptClockShiftComponent,
    CardReadmeComponent,
    CalculatorDiscountComponent,
    //FinancialsComponent,
    CalculatorCashOutInComponent,
    CalculatorAdjustComponent,
    ListUserComponent,
    CalculatorTipCashComponent,
    CardAdjustComponent,
    CardCalculatorComponent,
    RptCloseBatchComponent,
    DlgClosebatchComponent,
    InvPictureRender,
    ButtonsMenuRender,
    DlgDiscountComponent,
    SettingsGeneralsComponent,
    SettingsGeneralsOptionSystemsComponent,
    SettingsPermisionsOptionSystemsComponent,
    SettingsNewPermissionsOptionComponent,
    SettingsOtherPermissionsOptionComponent,
    HaveKeycardComponent,
    UpdateUserComponent,
    ButtonsTable,
    InventoryComponent,
    CardComponentEditComponent,
    ComponentEditComponent,
    RptMenuItemsSalesComponent,
    RptSalesRevenueComponent,
    CardCategoryComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    NgApexchartsModule,
    NgxDaterangepickerMd.forRoot(),
    AgGridModule,
    ReactiveFormsModule,
    NgxTouchKeyboardModule,
    CoreModule,
    OverlayModule,
    CardModiferGroupComponent,
    DropdownModifierGroupComponent,
    DropdownElementModifierGroupComponent,
    CardElementModifierGroupComponent,
    DropdownDepartmentComponent,
    SliderComponent,
    SliderPhotoComponent,
    SafeUrlPipe,
    ProgressCircleComponent,
    SchedulerCardComponent,
    DateRangeComponent,
    FormDateRangeComponent,
    BlockRptSalesRevenueComponent,
    BlockRptMenuItemsBestsellerComponent,
    SelectTableComponent,
    ButtonDateRangeComponent,
    PortalModule,
    ScrollEarringComponent,
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],


})
export class HomeModule {
}
