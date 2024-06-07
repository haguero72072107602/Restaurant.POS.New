import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LayoutComponent} from "@modules/home/component/layout/layout.component";
import {InvoiceComponent} from "./containers/invoice/invoice.component";
import {PayComponent} from "./containers/pay/pay.component";
import {ReportsComponent} from './containers/reports/reports.component';
import {SettingsComponent} from './containers/settings/settings.component';
import {CategoryComponent} from "@modules/home/component/list-category/category.component";
import {ListProductsComponent} from "@modules/home/component/list-products/list-products.component";
import {OrdersComponent} from './containers/orders/orders.component';
import {PayOrderComponent} from './component/pay-order/pay-order.component';
import {ListOrderComponent} from './component/list-order/list-order.component';
import {TestingComponent} from "@modules/home/containers/testing/testing.component";
import {
  RptResumenOperationComponent
} from "@modules/home/component/rpt-resumen-operation/rpt-resumen-operation.component";
import {AuthenticationGuard} from "@core/guards/authentication.guard";
import {RptBlackComponent} from "@modules/home/component/rpt-black/rpt-black.component";
import {TablesComponent} from "@modules/home/containers/tables/tables.component";
import {CustomersComponent} from "@modules/home/containers/customers/customers.component";
import {ListCustomersComponent} from "@modules/home/component/list-customers/list-customers.component";
import {ListTablesComponent} from "@modules/home/component/list-tables/list-tables.component";
import {RptSalesDaysComponent} from "@modules/home/component/rpt-sales-days/rpt-sales-days.component";
import {CanDeactivateGuard} from "@core/guards/candeactivate.guard";
import {RptClockShiftComponent} from "@modules/home/component/rpt-clock-shift/rpt-clock-shift.component";
import {RptCloseDayComponent} from "@modules/home/component/rpt-close-day/rpt-close-day.component";
import {ViewInvoiceComponent} from "@modules/home/component/view-invoice/view-invoice.component";
import {ListUserComponent} from "@modules/home/component/list-user/list-user.component";
import {RptCloseBatchComponent} from "@modules/home/component/rpt-close-batch/rpt-close-batch.component";
import {SettingsGeneralsComponent} from "@modules/home/component/settings-generals/settings-generals.component";
import {ListComponentsComponent} from "@modules/home/component/list-components/list-components.component";
import {InventoryComponent} from "@modules/home/containers/Inventory/inventory.component";
import {RptFinancialNewComponent} from "@modules/home/component/rpt-financial-new/rpt-financial-new.component";
import {ListMenuComponent} from "@modules/home/component/list-menu/list-menu.component";
import {ListModifiersComponent} from "@modules/home/component/list-modifiers-group/list-modifiers.component";
import {RptSalesRevenueComponent} from "@modules/home/component/rpt-sales-revenue/rpt-sales-revenue.component";
import {RptFinancialComponent} from "@modules/home/component/rpt-financial/rpt-financial.component";
import {RptMenuItemsSalesComponent} from "@modules/home/component/rpt-menu-items-sales/rpt-menu-items-sales.component";
import {MenuEditComponent} from "@modules/home/component/list-menu/menu-edit/menu-edit.component";
import {ComponentEditComponent} from "@modules/home/component/list-components/component-edit/component-edit.component";
import {ListSchedulerComponent} from "@modules/home/component/list-scheduler/list-scheduler.component";
import {EditCustomerComponent} from "@modules/home/component/list-customers/edit-customer/edit-customer.component";
import {RptSalesHistoryComponent} from "@modules/home/component/rpt-sales-history/rpt-sales-history.component";

const routes: Routes = [
  {
    path: "", redirectTo: "layout/invoice", pathMatch: "full"
  },
  {
    path: "layout", component: LayoutComponent,
    canActivate: [AuthenticationGuard],
    children:
      [
        {
          path: 'invoice', component: InvoiceComponent,
          canActivate: [AuthenticationGuard],
          children:
            [
              {
                path: 'departaments', component: CategoryComponent
              },
              {
                path: 'products/:dpto', component: ListProductsComponent
              },
              {
                path: '', redirectTo: '/auth/users/loginuser', pathMatch: "full"
              }
            ]
        },
        {
          path: 'orders', component: OrdersComponent,
          children:
            [
              {
                path: 'order/:order', component: PayOrderComponent, canDeactivate: [CanDeactivateGuard]
              },
              {
                path: 'orderlist', component: ListOrderComponent
              },
              {
                path: 'orderview', component: ViewInvoiceComponent, canDeactivate: [CanDeactivateGuard]
              },
              {
                path: '', redirectTo: 'orderlist', pathMatch: "full"
              }
            ]
        },
        {
          path: 'customers', component: CustomersComponent,
          children:
            [
              {
                path: 'customerslist', component: ListCustomersComponent
              },
              {
                path: 'editCustomer/:id', component: EditCustomerComponent
              },
              {
                path: '', redirectTo: 'editCustomer', pathMatch: "full"
              }
            ]
        },
        {
          path: 'tables', component: TablesComponent,
          children:
            [
              {
                path: 'tableslist', component: ListTablesComponent
              },
              {
                path: '', redirectTo: 'tableslist', pathMatch: "full"
              }
            ]
        },
        {
          path: 'inventory', component: InventoryComponent,
          children:
            [
              {
                path: 'products', component: ListMenuComponent
              },
              {
                path: 'components', component: ListComponentsComponent
              },

              {
                path: 'modifiers', component: ListModifiersComponent
              },
              {
                path: 'productEdit/:id', component: MenuEditComponent
              },
              {
                path: 'componentEdit/:id', component: ComponentEditComponent
              },
              {
                path: '', redirectTo: 'products', pathMatch: "full"
              }
            ]
        },
        {
          path: 'pay', component: PayComponent,
        },
        {
          path: 'customers', component: CustomersComponent,
          children: [
            {
              path: 'list', component: ListCustomersComponent
            },
            {
              path: 'componentEdit/:id', component: ComponentEditComponent
            },
            {
              path: '', redirectTo: 'list', pathMatch: "full"
            }
          ]
        },
        {
          path: 'reports', component: ReportsComponent,
          children: [
            {
              path: 'black', component: RptBlackComponent,
            },
            {
              path: 'operationsummary', component: RptResumenOperationComponent,
            },
            {
              path: 'rptclockshift', component: RptClockShiftComponent,
            },
            {
              path: 'rptclockday', component: RptCloseDayComponent,
            },
            {
              path: 'dashboard', component: RptFinancialNewComponent,
            },
            {
              path: 'rptsalesdays', component: RptSalesDaysComponent,
            },
            {
              path: 'rptfinancialdetails', component: RptFinancialComponent,
              /*/:openTime/:closeTime*/
            },

            {
              /*path: '', redirectTo: 'black', pathMatch: "full"*/
              path: 'rptsalesrevenue', component: RptSalesRevenueComponent,
            },
            {
              path: 'rptbestselledproducts', component: RptMenuItemsSalesComponent,
            },
            {
              path: 'rptsaleshistory', component: RptSalesHistoryComponent,
            },
            {
              path: '', redirectTo: 'black', pathMatch: "full"
            }

          ]
        },
        {
          path: 'settings', component: SettingsComponent,
          children: [
            {
              path: 'userslist', component: ListUserComponent
            },
            {
              path: 'closebatch', component: RptCloseBatchComponent
            },
            {
              path: 'settinggenerals', component: SettingsGeneralsComponent
            },
            {
              path: 'schedulerlist/:id', component: ListSchedulerComponent
            },
          ]
        },
        {
          path: 'test', component: TestingComponent
        },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
