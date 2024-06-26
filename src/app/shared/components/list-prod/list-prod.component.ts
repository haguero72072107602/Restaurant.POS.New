import {Component, OnInit} from '@angular/core';
import {Product} from '../../../models/product.model';
import {StockService} from "../../../services/bussiness-logic/stock.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EOperationType} from "../../../utils/operation.type.enum";
import {leaveFocusOnButton} from "../../../utils/functions/functions";
import {DialogFilterComponent} from "../../containers/dialog-filter/dialog-filter.component";
import {Observable} from "rxjs";
import {Department} from "../../../models/department.model";
import {EDepartmentType} from "../../../utils/department-type.enum";

@Component({
  selector: 'app-list-prod',
  templateUrl: './list-prod.component.html',
  styleUrls: ['./list-prod.component.scss']
})
export class ListProdComponent implements OnInit {
  prods: Product[] = [];
  prodsByDpto: Product[] = [];
  dptTax: number;
  page: number = 1;
  sizePage = 20;
  loading = false;
  dpto: any;
  lastPage = 5;
  filtered = false;
  textFilter: string;
  allProductsLoaded = false;

  //breakWordOrAll = 'break-all';

  constructor(private router: Router, private route: ActivatedRoute, public stockService: StockService) {
    this.sizePage = this.stockService.getStockCountItems();
    console.log(this.sizePage, this.stockService.cashService.config.sysConfig.breakText);
    //this.breakWordOrAll = this.stockService.cashService.systemConfig.breakText;
  }

  ngOnInit() {

    this.route.params.subscribe(p => {
      console.log('onInit', p);
      if (p['filter']) {
        Object.assign(this.prods, this.stockService.productsFiltered);
        Object.assign(this.prodsByDpto, this.stockService.productsFiltered);
        this.filtered = true;
        this.textFilter = p['filter'].trim();
      } else if (p['dpto'] && p['tax']) {
        this.loading = true;
        this.dptTax = p['tax'];
        this.dpto = p['dpto'];
        this.stockService.getProductsByDepartment(p['dpto'], 1, this.sizePage * this.lastPage)
          .subscribe(prods => {
            this.loading = false;
            Object.assign(this.prods, prods);
            Object.assign(this.prodsByDpto, prods);
          }, error1 => {
            this.loading = false;
            this.stockService.cashService.openGenericInfo('Error', error1/*'Can\'t get products for this deparment'*/);
            this.router.navigateByUrl('/home/layout/invoice/departaments');
          });
      }
    });
  }

  doAction(ev, prod: Product) {
    console.log('doAction', ev, prod);
    leaveFocusOnButton(ev);
    //this.stockService.productOrderService.addProduct(prod);
    this.stockService.changePriceOrAddProduct(prod);
  }

  setPage(ev) {
    if (ev > this.page) {
      this.stockService.setOperation(EOperationType.PageNext, 'Stock Products', 'Products: ' + ev);
      this.lastPage += 1;
      if (!this.allProductsLoaded) {
        (!this.filtered) ? this.addProds(this.stockService.getProductsByDepartment(this.dpto, this.lastPage, this.sizePage)) :
          this.addProds(this.stockService.getProductsByFilter(this.textFilter, this.lastPage, this.sizePage));
      }

    } else {
      this.stockService.setOperation(EOperationType.PagePrevious, 'Stock Products', 'Products: ' + ev);
    }
    this.page = ev;
  }

  filter() {
    this.stockService.cashService.dialog.open(DialogFilterComponent, {
      width: '1024px',
      height: '600px',
      disableClose: true
    })
      .afterClosed()
      .subscribe(next => {
        if (next && next.text) {
          console.log('filterDialog', next, this.prodsByDpto);
          this.lastPage = 5;
          this.textFilter = next.text.trim();
          this.filtered = true;
          /*let prods = this.prodsByDpto.filter(p => p.name.includes(next.text));
          prods.length <= 0 ?
            this.stockService.cashService.openGenericInfo('Information', 'Not match any products with ' +
              'the specified filter')
            :
            this.prods = prods;
            this.page = 1;*/
          this.stockService.getProductsByFilter(next.text, 1, this.sizePage * this.lastPage).subscribe(prods => {
            this.prods.splice(0);
            this.prodsByDpto.splice(0);
            Object.assign(this.prods, prods);
            Object.assign(this.prodsByDpto, prods);
            this.page = 1;
          }, err => {
            this.stockService.cashService.openGenericInfo('Error', 'Not match any products with ' +
              'the specified filter');
          });
        }
      });
  }

  getColorByProp(prod: Product): string {
    let color = 'normal';
    if (prod.generic) {
      color = 'generic';
    } else if (prod.scalable) {
      color = 'scalable';
    }
    return color;
  }

  getBreakTextType() {
    return this.stockService.cashService.config.sysConfig.breakText;
  }

  backDepts() {
    let dept: Department[] = this.stockService.productOrderService.departments
      .filter(dept => dept.id === this.dpto);

    (dept.length === 1 && dept[0].departmentType === EDepartmentType.CHILD) ?
    //this.router.navigateByUrl('cash/dptos/' + dept[0].parentId) :
    //this.router.navigateByUrl('cash/dptos/');
  }

  private addProds(prods: Observable<Product[]>) {

    prods.subscribe(prods => {
      this.allProductsLoaded = (this.sizePage > prods.length) ? true : false;
      prods.map(prod => {
        this.prods.push(prod);
        this.prodsByDpto.push(prod);
      });
      console.log('Next page filtered', prods);
    }, error1 => {
      console.error('Next page filtered', error1);
    });
  }
}
