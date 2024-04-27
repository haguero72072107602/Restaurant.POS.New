import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchCategoriesPipe} from './pipe/search-categories.pipe';
import {SearchProductsPipe} from './pipe/search-products.pipe';
import {SearchTablePipe} from "@core/pipe/search-user.pipe";
import {CanDeactivateGuard} from "@core/guards/candeactivate.guard";
import {AuthenticationGuard} from "@core/guards/authentication.guard";
import {GroupProductOrderPipe} from "@core/pipe/group-product-order.pipe";
import {FilterProductOrderPipe} from "@core/pipe/filter-product-order.pipe";
import {SearchLayoutPipe} from "@core/pipe/search-layout.pipe";
import {FilterInventoryPipe} from "@core/pipe/filter-inventory.pipe";


@NgModule({
  declarations: [
    SearchProductsPipe,
    SearchCategoriesPipe,
    SearchTablePipe,
    GroupProductOrderPipe,
    FilterProductOrderPipe,
    SearchLayoutPipe,
    FilterInventoryPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SearchProductsPipe,
    SearchCategoriesPipe,
    SearchTablePipe,
    GroupProductOrderPipe,
    FilterProductOrderPipe,
    SearchLayoutPipe
  ],
  providers: [AuthenticationGuard, CanDeactivateGuard]
})
export class CoreModule {
}
