import {Component, Input, OnInit} from '@angular/core';
import {Product} from "@models/product.model";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {ProductOrderService} from "@core/services/bussiness-logic/product-order.service";
import {MatDialog} from "@angular/material/dialog";
import {
  AddUpdateProductOrderComponent
} from "@modules/home/component/add-update-product-order/add-update-product-order.component";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {ProductOrder} from "@models/product-order.model";
import {IProductRestaurantDetails} from "@models/product-restaurant-details.model";
import {ETXType} from "@core/utils/delivery.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {Order} from "@models/order.model";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {SchedulerType} from "@core/utils/scheduler-type.enum";
import {SafeUrlPipe} from "@core/pipe/safeUrl.pipe";

import {trigger, transition, useAnimation} from '@angular/animations';
import {zoomIn} from 'ng-animate';
import {AuthService} from "@core/services/api/auth.service";
import {GroupDetail} from "@models/group.detail";
import {Aggregate} from "@models/aggregate";

@Component({
  standalone: true,
  selector: 'app-card-product',
  templateUrl: './card-product.component.html',
  imports: [
    SafeUrlPipe
  ],
  styleUrls: ['./card-product.component.css'],
  animations: [
    trigger('bounce', [transition('* => *', useAnimation(zoomIn))])
  ],
})
export class CardProductComponent implements OnInit {
  @Input("product") product!: Product;

  protected readonly zoomIn = zoomIn;
  protected readonly SchedulerType = SchedulerType;

  constructor(private dialog: MatDialog,
              private invoiceService: InvoiceService,
              private productOrderService: ProductOrderService,
              private operationService: OperationsService,
              private authService: AuthService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
  }

  onDialogAdd(product: Product) {
    if (product.generic) {
      this.productOrderService.addProduct(product);
    } else {
      this.dialogService
        .openDialogProduct({product: this.createProductEdit(product), disableDel: true})
        .afterClosed().subscribe((data: any) => {
        if (data) {

          switch (data.action) {
            case "Add":
              this.invoiceService.invoice!.status = InvoiceStatus.IN_PROGRESS;
              this.invoiceService.qty = data.productOrder.quantity;
              this.onDeleteNotUse(data.productOrder);
              data.productOrder.position = this.invoiceService.positionTable;
              this.invoiceService.addProductOrder(data.productOrder);
              break;
          }
        }
      });
    }
  }

  onAddProduct(product: Product) {
    const statusInvoice = [
      InvoiceStatus.PAID,
      InvoiceStatus.PENDENT_FOR_PAYMENT,
      InvoiceStatus.PENDENT_FOR_AUTHORIZATION,
      InvoiceStatus.CANCEL];

    if (!statusInvoice.includes(this.invoiceService.invoice?.status!)) {
      if (this.invoiceService.receiptNumber === undefined || this.invoiceService.receiptNumber.trim() === "") {
        this.invoiceService.createInvoice(ETXType.FAST_FOOD, undefined, i => {
          this.onDialogAdd(product)
        });
      } else {
        this.onDialogAdd(product)
      }
    } else {
      this.dialogService
        .openGenericInfo("Information", "You cannot add products to this order...");
    }
  }

  onAddItemToOrder(product: Product) {
    this.operationService.resetInactivity(false);
    if (this.invoiceService.txType === ETXType.DINEIN && this.invoiceService.order === undefined) {
      this.operationService.openAssignTable().subscribe((next: any) => {
        if (next) {
          this.invoiceService.createInvoice(ETXType.DINEIN, next.table!.id, i => {
            this.invoiceService.setDineIn(next.table)
              .subscribe((next: Order) => {
                this.invoiceService.order = next;
                this.invoiceService.setOrderEmit(next);
                this.onDialogAdd(product);
              }, error => {
                this.dialogService.openGenericInfo("Error", error)
              });
          });
        }
      });
    } else {
      this.onAddProduct(product);
    }
  }

  onDeleteNotUse(productOrder: ProductOrder) {
    /*
    productOrder.sides = productOrder.sides?.filter((value: IAggregateProduct)=> value.count === 1);
    productOrder.extraSides = productOrder.extraSides?.filter((value: IAggregateProduct)=> value.count != 0);
    productOrder.openSides = productOrder.openSides?.filter((value: IAggregateProduct)=>value.count === 1)
    productOrder.preparationMode = productOrder.preparationMode?.filter((value: IAggregateProduct)=> value.selected);
    */
    if (productOrder.schedulerActive && productOrder.schedulerType === SchedulerType.Promotion) {
      this.productOrderService.processPromotion(productOrder);
    }

    /*
    productOrder.groupDetails?.forEach((p: any) => {
      p.aggregates = p.aggregates.filter((h: any) => h.count != 0)
    });
    */
  }

  createProductEdit(product: Product) {
    const productOrder: ProductOrder = this.productOrderService.createProductOrder(product);

    this.invoiceService.getOptionsProduct(productOrder.productId).subscribe(
      (prodDetails: IProductRestaurantDetails) => {

        console.log(prodDetails);
        //prodDetails.sides?.map( item => item.count = 0);
        /*
        productOrder.sides =  prodDetails.sides;
        productOrder.extraSides =  prodDetails.extraSides;
        productOrder.openSides =  prodDetails.openSides;
        productOrder.preparationMode =  prodDetails.preparationModes;

        productOrder.sides?.map((item : any)=>{ item.count = 0});
        productOrder.openSides?.map((item : any)=>{ item.price = item.unitCost});
        productOrder.extraSides?.map((item : any)=>{ item.price = item.unitCost});
        productOrder.preparationMode?.map((item : any)=>{ item.selected = false });
       */
        productOrder.groupDetails = prodDetails.groupDetails;
        //productOrder.productDetailsDto?.groupDetails = prodDetails.groupDetails;

        productOrder.groupDetails?.forEach( (g: GroupDetail)=> {
          if (g.isDefault)
          {
            g.aggregates?.forEach( (a:Aggregate) =>{
              a.count = 1;
            })
          }
        });

        /* Check first Free product */

        if (productOrder.firstFree) {
          let gdFirstFree = productOrder.groupDetails?.find(gd => gd.id === '-100');

          gdFirstFree!.aggregates = gdFirstFree!.aggregates!.filter(ag => ag.id == productOrder.productId)
        }
      });

    return productOrder;
  }

  getPriceProduct(product: Product) {
    if (product.isStar) {
      return (product.schedulerActive && product.schedulerType === SchedulerType.HappyHour) ?
        product.schedulerPrice!.toFixed(2) : product!.starPrice!.toFixed(2)
    }

    if (product.schedulerActive && product.schedulerType === SchedulerType.HappyHour) {
      return product.schedulerPrice!.toFixed(2);
    }

    return product!.unitCost!.toFixed(2);
  }
}
