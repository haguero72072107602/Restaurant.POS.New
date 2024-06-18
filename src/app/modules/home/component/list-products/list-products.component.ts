import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Product} from '@models/product.model';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable, of, Subscription} from "rxjs";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {Department} from "@models/department.model";
import {map} from "rxjs/operators";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {HomeModule} from "@modules/home/home.module";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {CardProductComponent} from "@modules/home/component/list-products/card-product/card-product.component";
import {ScrollButtonsComponent} from "@modules/home/component/list-products/scroll-buttons/scroll-buttons.component";
import {ScrollEarringComponent} from "@modules/home/component/scroll-earring/scroll-earring.component";
import {Invoice} from "@models/invoice.model";

@Component({
  standalone: true,
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  imports: [
    ProgressSpinnerComponent,
    CardProductComponent,
    ScrollButtonsComponent,
    ScrollEarringComponent
  ],
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent extends AbstractInstanceClass implements OnInit, OnDestroy {
  public loading: boolean = true;
  public prods: Product[] = [];
  departments$?: Observable<Department[]>;
  products$?: Observable<Product[]>;
  selectDepartament: string = "All";
  selected: any;
  @ViewChild("scrollEarring", {static: true}) scrollEarring!: ScrollEarringComponent
  private subscription?: Subscription[];

  constructor(private router: Router,
              private actRouter: ActivatedRoute,
              private dialogService: DialogService,
              private departProductService: DepartProductService,
              private operationService: OperationsService,
              private searchService: SearchService) {
    super()

    this.searchService.setActivePage(PageSidebarEnum.STORE)

    this.sub$.push(
      this.searchService.searchObservable().subscribe((search: string) => {
        this.onSearchProducts(search)
      }));
    //this.searchService.searchObservable().subscribe((search: string) => {
    //  this.onSearchProducts(search)
    //});
  }

  get departamentOrderBy() {
    return this.departProductService.getDepartamentOrderBy()
  }

  override ngOnInit() {
    this.departments$ = of(this.departProductService.getDepartament().filter(d => !d.generic));
    this.products$ = of(this.departProductService.getProducts());
    /*
    this.departments$ = this.stockService.getDepartments()
      .pipe(map((depart: Department[]) => {
          return depart.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }))
      .pipe(map((depart: Department[]) => {
        return depart.filter(d => !d.generic);
      }));
    */

    //this.products$ = this.stockService.getProductsList();

    this.actRouter.params.subscribe((p: any) => {
      console.log('Router departament', p);
      if (p['dpto']) {
        p['dpto'] === "-99" ? this.onSearchProducts(this.searchService.getSearch()) :
          this.onSearchProductOfDepartament(p['dpto']);
      }
    });

    this.sub$.push(this.operationService.subscribeNotificationInvoicePending()
      .subscribe((next: boolean) => {
        if (next) {
          //debugger;
          this.scrollEarring!.setDataPendingInvoice();
        }
      }));
  }

  onGoCategories() {
    this.router.navigateByUrl("home/layout/invoice/departaments");
  }

  evDepartament($event: string) {
    this.selectDepartament = $event;
    switch ($event) {
      case "All":
        this.onGoCategories()
        break;
      default:
        this.onSearchProductOfDepartament($event)
        break;
    }
  }

  onSearchProductOfDepartament(dpto: string) {
    console.log("select dpto", dpto)

    this.loading = true;
    this.products$?.pipe(map((next: Product[]) => {
      return next;
    })).subscribe((next: Product[]) => {

      this.loading = false;
      this.selectDepartament = dpto;

      this.prods = next;

      this.prods = next.filter(item => !item.generic && item.departmentId?.toUpperCase() === dpto.toUpperCase());
      this.prods = this.prods.sort((a, b) => (a.name! < b.name! ? -1 : 1));

      console.log("order product ", this.prods);

    }, (error: any) => {
      console.log(error);
      this.loading = false;
      this.dialogService.openGenericInfo('Error', error);
    });
  }

  evOpenInvoice($event: Invoice) {
    this.operationService.reopenOrder($event.receiptNumber!, false);
  }

  private onSearchProducts(search: string) {
    this.loading = true;
    this.products$?.pipe(map((next: Product[]) => {
      return next.filter((prods: Product) => {
        return prods.name!.toUpperCase().includes(search.toUpperCase()) ||
          prods.unitInStock!.toString().toUpperCase().includes(search.toUpperCase()) ||
          prods.upc!.toUpperCase().includes(search.toUpperCase());
      })
    }))
      .subscribe((items: Product[]) => {
        this.loading = false;
        this.prods = items.filter(next => !next.generic);
        this.prods = this.prods.sort((a, b) => (a.name! < b.name! ? -1 : 1));
        this.selectDepartament = "All";
      }, error => {
        this.loading = false;
        this.dialogService.openGenericInfo('Error', error);
      });
  }
}
