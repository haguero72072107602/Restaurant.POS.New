import {inject, Injectable} from "@angular/core";
import {Department} from "@models/department.model";
import {Product} from "@models/product.model";
import {BehaviorSubject, concatMap, Observable, Subject} from "rxjs";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DomSanitizer} from "@angular/platform-browser";
import {SchedulerNotification} from "@models/scheduler-notification.model";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {SchedulerType} from "@core/utils/scheduler-type.enum";


@Injectable({
  providedIn: 'root'
})
export class DepartProductService {
  dataStore = inject(DataStorageService);
  dialogService = inject(DialogService);

  private departament: Department[] = []
  private products: Product[] = []

  private searchDepart$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private sanitizer: DomSanitizer) {
  }

  get isHappyHourProduct(): boolean {
    return this.products
      .find((value: Product) => value.schedulerType === SchedulerType.HappyHour && value.schedulerActive) != undefined
  }

  get isPromotionProduct(): boolean {
    return this.products
      .find((value: Product) => value.schedulerType === SchedulerType.Promotion && value.schedulerActive) != undefined
  }

  get isStarProduct(): boolean {
    return this.products.find((value: Product) => value.isStar) != undefined
  }

  public searchDepartObservable() {
    return this.searchDepart$.asObservable();
  }

  getDepartments(): Observable<Department[]> {
    return this.dataStore.getDepartments();
  }

  getProductsList(): Observable<Product[]> {
    return this.dataStore.getProductList();
  }

  public loadData() {
    const departObservable = this.getDepartments();
    const prodObservable = this.getProductsList()

    departObservable.pipe(
      concatMap((nextDepart) => {
        console.log("list departament", nextDepart);
        this.departament = nextDepart;
        return prodObservable;
      })
    ).subscribe((nextProd) => {
      console.log("list products", nextProd)
      this.products = nextProd;

      this.searchDepart$.next(true);
    }, error => {
      this.dialogService.openGenericInfo("Error", error)
    });
  }

  public LoadDataProduct() {
    this.getProductsList().subscribe((next: Product[]) => {
      return next;
    })
  }

  getDepartamentOrderBy(): Department[] {
    return this.departament.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }).filter(f => !f.generic && f.visible);
  }

  getDepartament(): Department[] {
    return this.departament.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    })
  }

  getProducts(): Product[] {
    return this.products
  }

  getProductsByDepartament(depart: Department) {
    return this.products.filter(p => p.departmentId === depart.id)
  }


  updateProduct(product: Product) {
    let productSearch = this.products.filter(p => p.id === product.id)[0];

    productSearch = Object.assign(productSearch, product)

    this.products = this.products.filter(p => p.id != product.id);

    this.products.push(productSearch);
  }

  appendProduct(product: Product) {
    this.products.push(product)
  }

  updateScheduler(schedulerNotification: SchedulerNotification) {
    let product = this.products.filter(p => p.id === schedulerNotification.productId)[0];
    if (product) {
      product.schedulerPrice = schedulerNotification.schedulerPrice;
      product.schedulerActive = schedulerNotification.schedulerActive;
      product.schedulerType = schedulerNotification.schedulerType;
      product.visible = schedulerNotification.visible;
      product.buyX = schedulerNotification.buyX;
      product.payY = schedulerNotification.payY;
    }
  }

}
