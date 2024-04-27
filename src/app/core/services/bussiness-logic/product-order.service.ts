import {Injectable, OnDestroy} from '@angular/core';
import {InvoiceService} from './invoice.service';
import {Subscription} from 'rxjs';
import {CashService} from './cash.service';
import {EOperationType} from '../../utils/operation.type.enum';
import {OperationsService} from './operations.service';
import {InvioceOpEnum} from '../../utils/operations';
import {StockOpEnum} from '../../utils/operations/stock-op.enum';
import {ScanOpEnum} from '../../utils/operations/scanner-op.enum';
import {InformationType} from '../../utils/information-type.enum';
import {InitViewService} from './init-view.service';
import {Department} from "@models/department.model";
import {Product} from "@models/product.model";
import {AgeValidationComponent} from "@shared/components/age-validation/age-validation.component";
import {GenericInfoModalComponent} from "@shared/components/generic-info-modal/generic-info-modal.component";
import {ProductOrder} from "@models/product-order.model";
import {ProductGenericComponent} from "@shared/components/product-generic/product-generic.component";
import {ProductGeneric} from "@models/product-generic";
import {IProductRestaurantDetails} from "@models/product-restaurant-details.model";
import {SidesPrepareComponent} from '@shared/containers/sides-prepare/sides-prepare.component';
import {IAggregateProduct, Option} from "@models/options.model";
import {CalculatorComponent} from "@modules/home/component/calculator/calculator.component";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";
import {AddNoteComponent} from "@modules/home/component/add-note/add-note.component";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {SchedulerType} from "@core/utils/scheduler-type.enum";
import {AuthService} from "@core/services/api/auth.service";

export const AGE = 18;

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService implements OnDestroy {
  // ageValidation: boolean;
  departments: Department[] = [];
  quantityByProduct = 1;
  subscription: Subscription [] = [];

  constructor(private invoiceService: InvoiceService, private cashService: CashService,
              private configService: ConfigurationService,
              private dialogService: DialogService,
              private modifierService: ModifierService,
              private authService: AuthService,
              private operationService: OperationsService, private initService: InitViewService) {

    this.subscription.push(this.invoiceService.evAddProdByUPC.subscribe(prod => this.addProduct(prod)));
    this.subscription.push(this.invoiceService.evEditRestaurantOp.subscribe((prod) => this.getSelectedDetails(prod)));
    this.subscription.push(this.operationService.evAddProdGen.subscribe(prod => this.productGeneric(prod)));
  }

  addProduct(product: Product): void {
    this.initService.setOperation(EOperationType.Add, 'Product', 'Before add product id: ' + product.id);
    if (this.invoiceService.allowAddProductByStatus()) {
      if (!this.isAddByPluOrScan()) {
        this.operationService.currentOperation = StockOpEnum.ADD_PROD;
      }
      if (product.followDepartment && this.departments) {
        const dpto = this.departments.find(dpto => dpto.id === product.departmentId);
        // const isAgeVerification = this.departments.find(dpto => dpto.id === product.departmentId).ageVerification;
        if (dpto && dpto.ageVerification && !this.invoiceService.invoice!.clientAge) {
          this.ageVerification(product);
        } else {
          this.onCreateProductOrder(product);
        }
      } else if (product.ageVerification && !this.invoiceService.invoice!.clientAge) {
        this.ageVerification(product);
      } else {
        this.onCreateProductOrder(product);
      }
    } else {
      this.dialogService.openGenericInfo(InformationType.INFO, 'Invoice status no let add products');
    }
  }

  isAddByPluOrScan() {
    return this.operationService.currentOperation === InvioceOpEnum.PLU ||
      this.operationService.currentOperation === ScanOpEnum.SCAN_PROD;
  }

  onAgeVerification() {
    return this.dialogService.dialog.open(AgeValidationComponent, {
      width: '480px',
      height: '650px',
      disableClose: true
    });
  }

  checkGenericProduct(product: Product) {
    if (!this.authService.adminLogged() && !this.configService.sysConfig.AllowUserOpenPrice) {
      this.authService.storeInitialLogin();
      this.operationService.adminLogin()
        .subscribe((loginValid: any) => {
          if (loginValid) {
            this.authService.restoreInitialLogin()
            this.openDialogGenericProd(product);
          }
        })
    } else this.openDialogGenericProd(product);
  }


  productGeneric(product: Product) {
    console.log('Product generic', this.operationService.currentOperation);
    if (this.invoiceService.allowAddProductByStatus()) {
      (product.prefixIsPrice && !this.isAddByPluOrScan()) ?
        this.prefixIsPrice(product) : this.checkGenericProduct(product)
    }
  }

  productWeightFormat(product: Product) {
    if (this.invoiceService.priceWic) {
      if (product.currentPrice) {
        this.quantityByProduct = Number(((+this.invoiceService.priceWic / 100) / product.currentPrice).toFixed(2));
        this.invoiceService.addProductOrder(this.createProductOrder(product, +this.invoiceService.priceWic / 100));
      } else {
        this.dialogService.openGenericInfo('Error', 'Can\'t add weight format product because unit cost is 0');
        this.invoiceService.resetDigits();
      }
      this.invoiceService.priceWic = '';
    } else {
      this.productScalable(product);
    }

  }

  productScalable(product: Product) {
    this.cashService.config.sysConfig.externalScale ?
      product.generic ? this.openDialogGenericProd(product) : this.invoiceService.addProductOrder(this.createProductOrder(product)) :
      this.openDialogScalableProd(product);
  }

  getSelectedDetails(productOrder: ProductOrder) {
    this.invoiceService.getSelectedOptionsProduct(productOrder.id).subscribe(
      (next: any) => {
        if (next.sides.length || next.openSides.length || next.extraSides.length || next.preparationModes.length) {
          // if (next.sides || next.openSides || next.extraSides || next.preparationModes) {
          console.log('selectedDetails', next);
          this.openDialogRestaurantProd(productOrder, next);
        }
      },
      error => console.error(error));
  }

  addProdScalable(product: Product, amount: number) {
    this.quantityByProduct = amount;
    product.generic ? this.openDialogGenericProd(product) :
      this.invoiceService.addProductOrder(this.createProductOrder(product));
  }

  getPriceProduct(product: Product) {
    if (product.isStar) {
      return (product.schedulerActive && product.schedulerType === SchedulerType.HappyHour) ?
        product.schedulerPrice : product.starPrice
    } else if (product.schedulerActive && product.schedulerType === SchedulerType.HappyHour) {
      return product.schedulerPrice;
    } else {
      return product.currentPrice;
    }
  }

  createProductOrder(prod: Product, totalWF?: number, sides?: Array<IAggregateProduct>, extraSides?: Array<IAggregateProduct>,
                     mode?: Array<Option>, openSides?: Array<IAggregateProduct>): ProductOrder {
    const qty = this.invoiceService.qty > 1 ? this.invoiceService.qty : this.quantityByProduct;
    if (this.quantityByProduct !== 1) {
      this.quantityByProduct = 1;
    }
    const tax = this.getTax(prod);

    let price = this.getPriceProduct(prod)!;

    const total = Number((qty * price).toFixed(2));

    let productOrder: Partial<ProductOrder> = {
      quantity: qty,
      unitCost: this.getPriceProduct(prod),
      total: total,
      tax: tax,
      subTotal: total,
      productId: prod.id,
      productUpc: prod.upc,
      productName: prod.name,
      foodStamp: prod.foodStamp,
      isRefund: prod.isRefund,
      discount: 0,
      scalable: prod.scalable,
      sides: sides,
      extraSides: extraSides,
      preparationMode: mode,

      restaurantDetails: prod.restaurantDetails,
      openSides: openSides,
      position: this.invoiceService.positionTable,
      note: "",
      //saved?:number;
      /*productDetailsDto? : ProductDetailsDto;*/
      //groupDetails?: Array<GroupDetail>;
      isStar: prod.isStar,
      starPrice: prod.starPrice,
      currentPrice: prod.currentPrice,

      schedulerActive: prod.schedulerActive,
      schedulerPrice: prod.schedulerPrice,
      schedulerType: prod.schedulerType,
      buyX: prod.buyX,
      payY: prod.payY,
      visible: prod.visible,
      printFinancial: prod.printFinancial,
      isHappyHour: prod.isHappyHour,

      firstFree: prod.firstFree
    }

    /*
    let productOrder = new ProductOrder(
      qty, price, totalWF ? totalWF : total, tax, 0,
      prod.id!, prod.upc!, prod.name!, prod.foodStamp!, prod.isRefund, 0, prod.scalable,
      sides, extraSides, mode, prod.restaurantDetails, openSides, this.invoiceService.positionTable!);

    productOrder.isStar = prod.isStar!;
    */

    return productOrder as ProductOrder
  }

  ngOnDestroy() {
    this.subscription.map(sub => sub.unsubscribe());
  }

  processPromotion(productOrder: ProductOrder) {
    if ((productOrder.quantity % productOrder.buyX) === 0) {
      let groupPromotions = productOrder.groupDetails?.filter(p => p.id === "-99");

      if (groupPromotions![0]) {
        let product = groupPromotions![0]
          .aggregates!.filter(prod => prod.id.toString() === productOrder.productId.toString())[0];

        const factor = (productOrder.quantity / productOrder.buyX)
        if (product) {
          product.count = (productOrder.buyX - productOrder.payY) * factor
          productOrder.quantity = productOrder.quantity - product.count;
        }
      }
    }
  }

  quantityProductInPromotion(productOrder: ProductOrder): ProductOrder {
    if (productOrder.schedulerActive && productOrder.schedulerType === SchedulerType.Promotion) {
      let groupPromotions = productOrder.groupDetails?.filter(p => p.id === "-99")!;
      if (groupPromotions[0]) {

        let product = groupPromotions![0]
          .aggregates!.filter(prod => prod.id.toString() === productOrder.productId.toString())![0];

        if (product) {
          productOrder.quantity = productOrder.quantity + product.count;
          product.count = 0;
        }
      }
    }
    if (productOrder.firstFree) {
      let gdFirstFree = productOrder.groupDetails?.find(gd => gd.id === '-100');

      gdFirstFree!.aggregates = gdFirstFree!.aggregates!.filter(ag => ag.id == productOrder.productId)
    }


    return productOrder;
  }

  copyInstance(original: any) {
    let copied = Object.assign(
      Object.create(
        Object.getPrototypeOf(original)
      ),
      original
    );
    return copied;
  }

  private invalidAge() {
    this.dialogService.dialog.open(GenericInfoModalComponent,
      {width: '300px', height: '220px', data: {title: 'Error', content: 'Invalid age.'}, disableClose: true});
  }

  private onCreateProductOrder(product: Product): void {
    if (product.scalable || product.generic || product.wic) {
      if (product.wic) {
        this.productWeightFormat(product);
      } else if (product.scalable) {
        this.productScalable(product);
      } else if (product.generic) {
        console.log('adminLogged', this.invoiceService.authService.adminLogged());
        this.cashService.config.sysConfig.allowAddProdGen ?
          this.productGeneric(product) :
          this.invoiceService.authService.adminLogged() ?
            this.productGeneric(product) :
            this.operationService.manager('prodGen', product);
      }
    } else if (product.restaurantDetails) {
      this.productRestaurant(product);
    } else {
      this.invoiceService.addProductOrder(this.createProductOrder(product));
    }
  }

  private productRestaurant(product: Product) {
    this.invoiceService.getOptionsProduct(product.id!).subscribe(
      (next: any) => {
        (next.sides.length || next.openSides.length || next.extraSides.length || next.preparationModes.length) ?
          // (next.sides || next.openSides || next.extraSides || next.preparationModes) ?
          this.openDialogRestaurantProd(product, next) :
          this.invoiceService.addProductOrder(this.createProductOrder(product));
      },
      err => this.dialogService.openGenericInfo(InformationType.ERROR, err)
    );
  }


  private openDialogGenericProd(product: Product): void {
    const dialogRef = this.dialogService.dialog.open(CalculatorComponent,
      {
        width: '511px', height: '650px', data: {titleCalculator: product.name},
        disableClose: true
      });

    dialogRef.afterClosed().subscribe((data: any) => {
      if (data!.cashInvoice && data!.cashInvoice! > 0) {

        product.currentPrice = Number(data.cashInvoice!);

        let productOrder = this.createProductOrder(product)

        if (this.configService.sysConfig.allowOpenPriceNote) {
          this.dialogService.dialog.open(AddNoteComponent,
            {
              width: '465px', height: '377px', data: {},
              disableClose: true
            }).afterClosed().subscribe((next: string) => {
            if (next) productOrder.note = next;
            this.invoiceService.addProductOrder(productOrder);
          });
        } else {
          this.invoiceService.addProductOrder(productOrder);
        }
      }
    });
  }

  private openDialogScalableProd(product: Product): void {
    console.log('openDialogScalableProd', product);
    if (this.invoiceService.qty > 0 && this.invoiceService.qty !== 1) {
      this.addProdScalable(product, this.invoiceService.qty);
    } else {
      const dialogRef = this.dialogService.dialog.open(ProductGenericComponent,
        {
          width: '448px',
          height: '540px',
          data: {name: product.name, label: 'Weight (Lbs)', unitCost: 0},
          disableClose: true
        });
      dialogRef.afterClosed().subscribe((data: ProductGeneric) => {
        if (data) {
          /*this.quantityByProduct = data.unitCost;
          product.generic ? this.openDialogGenericProd(product):
            this.invoiceService.addProductOrder(this.createProductOrder(product));*/
          this.addProdScalable(product, data.unitCost!);
        }
      });
    }
  }

  private openDialogRestaurantProd(product: Product | ProductOrder, options: IProductRestaurantDetails): void {
    // if(options.sides || options.extraSides || options.openSides || options.preparationModes) {
    this.dialogService.dialog.open(SidesPrepareComponent,
      {
        width: '850px', height: '750px', data: {
          label: 'name', options: options,
          limitSides: this.cashService.config.sysConfig.limitSides, product: product
        },
        disableClose: true
      }).afterClosed().subscribe((data: any) => {
      if (data) {
        console.log(data);
        const sides = (data.sides && data.sides.length) ?
          data.sides.map((v: any) => ({id: v.id, price: v.currentPrice, count: 1})) : [];
        const extraSides = (data.extras && data.extras.length) ?
          data.extras.map((v: any) => ({id: v.id, price: v.currentPrice, count: v.count})) : [];
        const openSides = (data.open && data.open.length) ?
          data.open.map((v: any) => ({id: v.id, price: v.currentPrice, count: 1})) : [];
        const mode = (data.modes && data.modes.length) ? data.modes[0].id : '';
        if ((<ProductOrder>product).quantity !== undefined) {
          (<ProductOrder>product).sides = sides;
          (<ProductOrder>product).extraSides = extraSides;
          (<ProductOrder>product).openSides = openSides;
          (<ProductOrder>product).preparationMode = mode;
          this.invoiceService.editProductOrder(<ProductOrder>product);
        } else {
          this.invoiceService.addProductOrder(this.createProductOrder(<Product>product, undefined, sides, extraSides, mode, openSides));
        }
      }
    });
    /* } else {
      this.invoiceService.addProductOrder(this.createProductOrder(<Product> product, null, null, null, null, null));
    } */

  }

  private getTax(product: Product) {
    let tax = 0;
    if (product.applyTax && product.followDepartment) {
      tax = this.departments.filter(dpto => dpto.id === product.departmentId).map(dpto => dpto.tax)[0];
    } else if (product.applyTax && !product.followDepartment) {
      tax = product.tax;
    }
    return tax;
  }

  private ageVerification(product: Product) {
    this.onAgeVerification().afterClosed().subscribe((data: any) => {
      if (data.age) {
        if (data.age >= product.ageAllow!) {
          this.invoiceService.updateClientAge(data.age);
          this.onCreateProductOrder(product);
        } else {
          this.invalidAge();
        }
      }
    });
  }

  private prefixIsPrice(product: Product) {
    if (this.invoiceService.digits) {
      if (this.invoiceService.digits.includes('@')) {
        const qtyPrice = this.invoiceService.digits.split('@').map(value => value.trim());
        this.quantityByProduct = +qtyPrice[0];
        this.invoiceService.digits = qtyPrice[1];
      }
      if (this.invoiceService.digits.length > 6) {
        this.dialogService.openGenericInfo('Information', 'The price specified is too long');
        this.invoiceService.resetDigits();
      } else {
        const prefixPrice = (+this.invoiceService.digits / 100).toFixed(2);
        product.currentPrice = +prefixPrice;
        this.invoiceService.addProductOrder(this.createProductOrder(product));
      }
    } else {
      console.log('No specified price for product with prefixIsPrice');
      this.checkGenericProduct(product);
      //this.openDialogGenericProd(product);
    }
  }

}
