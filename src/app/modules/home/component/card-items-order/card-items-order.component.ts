import {Component, inject, Input, OnInit} from '@angular/core';
import {InvoiceService} from '@core/services/bussiness-logic/invoice.service';
import {ProductOrder} from '@models/product-order.model';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';
import {
  AddUpdateProductOrderComponent
} from "@modules/home/component/add-update-product-order/add-update-product-order.component";
import {ProductOrderService} from "@core/services/bussiness-logic/product-order.service";
import {MatDialog} from "@angular/material/dialog";
import {Product} from "@models/product.model";
import {IProductRestaurantDetails} from "@models/product-restaurant-details.model";
import {IAggregateProduct, Option} from "@models/options.model";
import {isArray} from "@angular/compiler-cli/src/ngtsc/annotations/common";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";
import {GroupDetail} from "@models/group.detail";
import {Aggregate} from "@models/aggregate";
import {SchedulerType} from "@core/utils/scheduler-type.enum";

@Component({
  selector: 'app-card-items-order',
  standalone: true,
  templateUrl: './card-items-order.component.html',
  styleUrls: ['./card-items-order.component.css']
})
export class CardItemsOrderComponent implements OnInit {

  @Input() productOrder!: ProductOrder;
  @Input() editProductOrder: boolean = true;

  constructor(private dialog: MatDialog,
              private invoiceService: InvoiceService,
              private productOrderService: ProductOrderService,
              private colorsService: ColorsService) {
  }

  ngOnInit(): void {
    this.createProductEdit(this.productOrder);
  }

  onUpdateProduct() {

    if (this.editProductOrder) {


      this.dialog.open(AddUpdateProductOrderComponent,
        {
          width: '745px', height: '649px',
          data: {
            product: this.productOrderService.quantityProductInPromotion(this.productOrder),
            disableDel: false,
            isRefund: this.invoiceService!.invoice!.isRefund
          },
          disableClose: true
        }).afterClosed().subscribe((data: any) => {
        if (data) {
          switch (data.action) {
            case "Add":
              data.productOrder = this.onUpdateSides(data.productOrder);
              this.invoiceService.editProductOrder(data.productOrder);
              break;
            case "Del":
              //this.invoiceService.deleteProductFromInvoice(data.productOrder)
              this.invoiceService.delPOFromInvoice([data.productOrder]);
              break;
          }
        }
      });
    }
  }

  createProductEdit(productOrder: ProductOrder) {
    this.invoiceService.getSelectedOptionsProduct(productOrder.id).subscribe(
      next => {
        if (next.groupDetails?.length! > 0) {
          productOrder.groupDetails = next.groupDetails;
        }
        /*
        if (next.sides!.length || next.openSides!.length || next.extraSides!.length || next.preparationModes!.length) {
          // if (next.sides || next.openSides || next.extraSides || next.preparationModes) {
          console.log('selectedDetails', next);
          productOrder.sides = next.sides;
          productOrder.extraSides = next.extraSides;
          productOrder.openSides = next.openSides;

          productOrder.openSides?.map(value => value.price =  value.unitCost);
          productOrder.extraSides?.map(value => value.price =  value.unitCost);

        }
        */
      },
      error => console.error(error));
    return productOrder;
  }

  onUpdateSides(productOrder: ProductOrder) {
    this.onDeleteNotUse(productOrder);
    this.opUpdateSelectedSides(productOrder);
    return productOrder;
  }

  onDeleteNotUse(productOrder: ProductOrder) {
    /*
    productOrder.sides = productOrder.sides?.filter((value: IAggregateProduct)=> value.count === 1);
    productOrder.extraSides = productOrder.extraSides?.filter((value: IAggregateProduct)=> value.count != 0);
    productOrder.openSides = productOrder.openSides?.filter((value: IAggregateProduct)=>value.count === 1);
    productOrder.preparationMode = productOrder.preparationMode?.filter((value: any)=> value.selected );
    */
    if (productOrder.schedulerActive && productOrder.schedulerType === SchedulerType.Promotion) {
      this.productOrderService.processPromotion(productOrder);
    }

    productOrder.groupDetails?.forEach((p: any) => {
      p.aggregates = p.aggregates.filter((h: any) => h.count != 0)
    });
  }

  onShowSides(sides: Array<IAggregateProduct>) {
    if (sides && Array.isArray(sides)) {
      const countSides = sides!.filter((value: IAggregateProduct) => {
        return value.count != 0
      });
      return countSides?.length! > 0;
    } else {
      return false;
    }
  }

  opUpdateSelectedSides(productOrder: ProductOrder) {
    /*
    productOrder?.sides?.map( (item : IAggregateProduct) => { item.selected =  (item.count != 0)});
    productOrder?.extraSides?.map( (item : IAggregateProduct) => { item.selected =  (item.count != 0)});
    productOrder?.openSides?.map( (item : IAggregateProduct) => { item.selected =  (item.count != 0)});
    //productOrder?.preparationMode?.map( (item : any) => { item.selected =  (item.count != 0)});
     */
    productOrder.groupDetails?.forEach((p: any) => {
      p.aggregates = p.aggregates.filter((h: any) => h.count != 0)
    });
  }

  getColor(position: number) {
    const color = "background: " + this.colorsService.getColor(position);
    return color;
  }

  getTotalExtraSides(count: number, price: number) {
    return !isNaN(count) && !isNaN(price) ? (count * price).toFixed(2) : ""
  }

  onShowNote(prodOrder: ProductOrder) {
    return (prodOrder && prodOrder!.note! && prodOrder!.note!.trim().length > 0);
  }

  onPreparationMode(options: Array<Option>) {
    const element = options.filter(p => p.selected);

    return element!.length > 0;
  }

  onShowAggregates(groupDetails: Array<GroupDetail>) {
    let countAggregate = 0
    if (groupDetails?.length > 0) {
      groupDetails?.forEach((g: GroupDetail) => {
        const sumCount = g.aggregates!.filter(a => a.count != 0).length;

        countAggregate += sumCount;
      })
      return countAggregate > 0
    } else return false
  }

  onShowGroup(aggregates: Aggregate[]) {
    return aggregates?.filter(a => a.count != 0).length > 0
  }

  getTotalGroup(groupDetail: GroupDetail) {
    return groupDetail?.aggregates?.reduce((a: number, b: Aggregate) => {
      return a + (b.count * b.price)
    }, 0);
  }

  getTotalAggregate(aggregate: Aggregate) {
    return aggregate?.price * aggregate?.count
  }

}

