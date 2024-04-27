import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Product} from "@models/product.model";
import {ProductService} from "@core/services/bussiness-logic/product.service";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {Dropdown} from "flowbite";
import {Scheduler} from "@models/scheduler.models";
import {SchedulerProduct} from "@models/scheduler-product.model";
import {FormsModule} from "@angular/forms";
import {
  SchedulerCardFrecuencyComponent
} from "@modules/home/component/list-scheduler/scheduler-card-frecuency/scheduler-card-frecuency.component";
import {
  SchedulerCardProductComponent
} from "@modules/home/component/list-scheduler/scheduler-card-product/scheduler-card-product.component";
import {debounceTime, fromEvent, Subscription, tap} from "rxjs";
import {map} from "rxjs/operators";
import {CoreModule} from "@core/core.module";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Component({
  selector: 'app-scheduler-dropdown-products',
  standalone: true,
  imports: [
    FormsModule,
    SchedulerCardFrecuencyComponent,
    SchedulerCardProductComponent,
    CoreModule
  ],
  templateUrl: './scheduler-dropdown-products.component.html',
  styleUrl: './scheduler-dropdown-products.component.css'
})
export class SchedulerDropdownProductsComponent implements AfterViewInit, OnInit {

  @ViewChild("inputSearchProduct", {static: true}) inputSearch!: ElementRef;
  @Input() scheduler?: Scheduler;
  @Output() evSchedulerAddProduct = new EventEmitter<SchedulerProduct>()
  @Output() evSchedulerDelProduct = new EventEmitter<SchedulerProduct>()

  public dropdown?: Dropdown;
  productsList: Product[] = [];
  productsListFilter: Product[] = [];
  titleSearch?: string;
  selectedProduct?: Product;
  priceProduct: number = 0;
  subscription!: Subscription;
  searchProduct: string = '';
  protected readonly SchedulerType = SchedulerType;

  constructor(
    private departProduct: DepartProductService
  ) {
  }

  ngOnInit(): void {
    this.productsList = this.departProduct.getProducts();
    this.productsListFilter = this.productsList;
    console.log("List products -> ", this.productsList)
  }

  ngAfterViewInit(): void {
    const $targetEl = document.getElementById('dropdownSearchModifier');
    const $triggerEl = document.getElementById('dropdownSearchButtonModifier');

    this.dropdown = new Dropdown($targetEl, $triggerEl);

    this.subscription = fromEvent<Event>(this.inputSearch.nativeElement, 'keyup')
      .pipe(
        map((event: Event) => {
          const searchForm = (event.target as HTMLInputElement).value;
          return searchForm;
        }),
        debounceTime(200),
        tap((searchForm: string) => {
          console.log(searchForm)
        }))
      .subscribe((search: string) => {
        this.searchText(search);
      });
  }

  selectItem($event: Product) {
    this.titleSearch = $event.name;
    this.dropdown?.hide();
    this.selectedProduct = $event;
  }

  addSchedulerProduct() {
    if (this.selectedProduct) {
      const schedulerProduct: Partial<SchedulerProduct> = {
        name: this.selectedProduct!.name,
        productId: this.selectedProduct!.id,
        schedulerId: this.scheduler?.id,
        upc: this.selectedProduct.upc,
        price: this.priceProduct,
        departmentId: this.selectedProduct.departmentId
      }
      this.evSchedulerAddProduct.emit(schedulerProduct as SchedulerProduct)
    }
  }

  evDeleteSchedulerProduct($event: SchedulerProduct) {
    this.evSchedulerDelProduct.emit($event)
  }

  private searchText(search: string) {
    console.log("search product ->", search);
    this.productsListFilter = this.productsList
      .filter(product => product.name!.toLowerCase()
        .includes(search.toLowerCase()) || product.id!.toLowerCase().includes(search.toLowerCase()));
  }
}

