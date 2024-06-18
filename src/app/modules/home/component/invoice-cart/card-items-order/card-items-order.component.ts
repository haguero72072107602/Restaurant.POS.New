import {Component, Input, OnInit} from '@angular/core';
import {InvoiceService} from '@core/services/bussiness-logic/invoice.service';
import {ProductOrder} from '@models/product-order.model';

import {ProductOrderService} from "@core/services/bussiness-logic/product-order.service";
import {MatDialog} from "@angular/material/dialog";
import {IAggregateProduct, Option} from "@models/options.model";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";
import {GroupDetail} from "@models/group.detail";
import {Aggregate} from "@models/aggregate";
import {SchedulerType} from "@core/utils/scheduler-type.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {Invoice} from "@models/invoice.model";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {fadeInLeftAnimation} from "@core/lib";

@Component({
  selector: 'app-card-items-order',
  templateUrl: './card-items-order.component.html',
  styleUrls: ['./card-items-order.component.css'],
  /*
  animations: [
    trigger('enterState', [
      transition(':enter', [
        animate('0.3s ease-in', keyframes([
          style({
            height: 0,
            opacity: 0,
            transform: 'translateX(-100%)'
          }),
          style({
            height: '50px',
          }),
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        ]))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', keyframes([
          style({
            height: '50px',
            opacity: 1,
            transform: 'translateX(0)'
          }),
          style({
            height: 0,
          }),
          style({
            opacity: 0,
            transform: 'translateX(-100%)'
          }),
        ]))
      ])
    ])
  ]
  */
})
export class CardItemsOrderComponent implements OnInit {

  @Input() productOrder!: ProductOrder;
  @Input() editProductOrder: boolean = true;

  stateY = 'expandCollapse';

  constructor(private dialog: MatDialog,
              private invoiceService: InvoiceService,
              private productOrderService: ProductOrderService,
              private dialogService: DialogService,
              private colorsService: ColorsService) {
  }

  ngOnInit(): void {
    this.createProductEdit(this.productOrder);
  }

  onUpdateProduct() {
    if (this.editProductOrder) {
      this.dialogService.openDialogProduct({
        product: this.productOrderService.quantityProductInPromotion(this.productOrder),
        disableDel: false,
        isRefund: this.invoiceService!.invoice!.isRefund
      }).afterClosed().subscribe((data: any) => {
        if (data) {

          switch (data.action) {
            case "Add":
              data.productOrder = this.onUpdateSides(data.productOrder);
              this.invoiceService.editProductOrder(data.productOrder)
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
    this.onUpdateSelectedSides(productOrder);
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

    /*
    productOrder.groupDetails?.forEach((p: any) => {
      p.aggregates = p.aggregates.filter((h: any) => h.count != 0)
    });
    */
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

  onUpdateSelectedSides(productOrder: ProductOrder) {
    /*
    productOrder?.sides?.map( (item : IAggregateProduct) => { item.selected =  (item.count != 0)});
    productOrder?.extraSides?.map( (item : IAggregateProduct) => { item.selected =  (item.count != 0)});
    productOrder?.openSides?.map( (item : IAggregateProduct) => { item.selected =  (item.count != 0)});
    //productOrder?.preparationMode?.map( (item : any) => { item.selected =  (item.count != 0)});

    productOrder.groupDetails?.forEach((p: any) => {
      p.aggregates = p.aggregates.filter((h: any) => h.count != 0)
    });
    */
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

