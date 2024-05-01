import {AfterViewInit, Component, ElementRef, Inject, SecurityContext, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Product} from "@models/product.model";
import {ProductOrder} from "@models/product-order.model";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {DomSanitizer} from "@angular/platform-browser";
import {IAggregateProduct, Option} from "@models/options.model";
import {ProductOrderService} from "@core/services/bussiness-logic/product-order.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";
import {GroupDetail} from "@models/group.detail";
import {Aggregate} from "@models/aggregate";
import {animate, style, transition, trigger} from "@angular/animations";
import {DiscountEvent} from "@models/discount-event.model";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogType} from "@core/utils/dialog-type.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-add-update-product-order',
  templateUrl: './add-update-product-order.component.html',
  styleUrls: ['./add-update-product-order.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({transform: 'scale3d(.3, .3, .3)'}),
        animate(50)
      ]),
      transition('* => void', [
        animate(50, style({transform: 'scale3d(.0, .0, .0)'}))
      ])
    ])
  ]
})
export class AddUpdateProductOrderComponent implements AfterViewInit {

  @ViewChild("btnProduct", {static: true}) btnProduct: undefined | ElementRef;

  public productOrder!: ProductOrder;
  disableDel: boolean = true;
  imageBase64?: string | null;
  costProductOpenSides: number = 0;

  isRefund: boolean = false;
  isNote: boolean = false;
  noteWriter?: string;
  isDiscount: boolean = false;
  discount!: DiscountEvent;

  constructor(private dialogRef: MatDialogRef<AddUpdateProductOrderComponent>,
              private invoiceService: InvoiceService,
              private productOrderService: ProductOrderService,
              private configService: ConfigurationService,
              private sanitizer: DomSanitizer,
              private cashService: CashService,
              private dialogService: DialogService,
              private operationService: OperationsService,
              @Inject(MAT_DIALOG_DATA) public data: any) {

    this.productOrder = data!.product;
    this.disableDel = data!.disableDel;
    this.isRefund = data!.isRefund;

  }

  get productOrderDiscount() {
    const prodOrder = this.invoiceService.invoice?.productOrders?.filter(p => p.id === this.productOrder.id)[0];

    return prodOrder ? prodOrder.saved : 0.00
  }

  ngAfterViewInit(): void {
    if (this.productOrder) {
      this.invoiceService.getProduct(this.productOrder.productId).subscribe((prod: Product) => {
        this.imageBase64 = prod.image != undefined ?
          this.sanitizer.sanitize(SecurityContext.NONE,
            this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + prod.image))
          : null
      });

      this.amountCostSides();
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onMinusProduct() {
    if (this.productOrder.quantity > 1) {
      this.productOrder.quantity -= 1;
    }
  }

  onPlusProduct() {
    this.productOrder.quantity += 1;
  }

  addProduct() {
    this.dialogRef.close({action: "Add", productOrder: this.productOrder});
  }

  delProduct() {
    this.dialogRef.close({action: "Del", productOrder: this.productOrder});
  }

  onOpenSides(sides: IAggregateProduct) {
    sides.count = sides.count === 0 ? 1 : 0;
    sides.selected = sides.count > 0;

    this.amountCostSides();
  }

  onResetCounter(sides: IAggregateProduct) {
    sides.count = -1;
  }

  onExtrasSides(sides: IAggregateProduct) {
    if (sides.count === this.cashService.config.sysConfig.limitSides) {
      sides.count = 0;
    } else {
      sides.count = sides.count! + 1;
    }
    sides.selected = sides.count > 0;

    this.amountCostSides();
  }

  onSides(sides: IAggregateProduct) {
    const countSides = this.productOrder?.sides?.reduce((a: number, b: IAggregateProduct) => {
        return a + b.count!
      }, 0),
      limitSides = !this.configService.sysConfig.sidesFree ? 1 : this.configService.sysConfig.sidesFree;

    if (countSides! <= limitSides! /*|| sides.count === 1*/) {
      sides.count = sides.count! + 1;
      sides.selected = sides.count! > 0;
    } else {
      sides.count = 0;
      sides.selected = false;
    }

  }

  amountCostSides() {
    /*
    const sumExtraSides =  this.productOrder?.extraSides?.filter( f => f.selected)
      .reduce( (a : number, b : IAggregateProduct)=>{ return a + ( b.price! * b.count! )}, 0);

    const sumOpenSides =this.productOrder?.openSides?.filter( f => f.selected)
      .reduce( (a : number, b : IAggregateProduct)=>{ return a + b.price!},0);

    this.costProductOpenSides = (
                                  (isNaN(sumExtraSides!)? 0 : sumExtraSides!)  +
                                  (isNaN(sumOpenSides!)? 0 : sumOpenSides!)
                                );

    */

    let amountTotal: number = 0;
    this.productOrder!.groupDetails?.forEach((groupDetail: GroupDetail) => {
      const amount = groupDetail.aggregates!
        .reduce((a: number, b: Aggregate) => {
          return a + (b.price * b.count)
        }, 0)

      amountTotal += amount;
    })

    this.costProductOpenSides = amountTotal;
  }

  onPreparationMode(preparation: Option) {
    preparation.selected = !preparation.selected;
  }

  onAggregate(groupDetail: GroupDetail, aggregate: Aggregate) {
    console.log(groupDetail)

    if (groupDetail.isDefault)
    {
      aggregate.count = aggregate.count === 1 ? 0 : 1
    }
    else
    {
      if (groupDetail.number != 0) {
        const count = groupDetail.aggregates!.reduce((a: number, b: Aggregate) => {
          return a + b.count
        }, 0);

        if (groupDetail.number! > count) {
          aggregate.count += 1;
        } else {
          aggregate.count = 0;
        }
      } else {
        aggregate.count += 1;
      }
    }
    this.amountCostSides();
  }

  resetAggregate($event: MouseEvent, aggregate: Aggregate) {
    $event.stopPropagation();
    aggregate.count = 0;
    this.amountCostSides();
  }

  noteAddOrUgrade() {
    this.productOrder!.note = this.noteWriter;
  }

  activeNote() {
    this.noteWriter = this.productOrder!.note;
    this.isNote = true;
  }

  activeDiscount() {
    this.isDiscount = true;
  }

  evDiscount($event: DiscountEvent) {
    console.log('Discount ->', $event)
    this.discount = $event;
  }

  acceptOperation() {
    try {
      if (this.isNote) this.noteAddOrUgrade();
      if (this.isDiscount) this.discountUgrade();

      this.cancelOperation();
    } catch (e: any) {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", e);
    }
  }

  cancelOperation() {
    if (this.isNote) this.isNote = false;
    if (this.isDiscount) this.isDiscount = false;
  }

  private discountUgrade() {
    /* Hacer el proce de discount */
    this.operationService
      .applyDiscountInvoice(this.discount.amount, this.discount.operation, this.productOrder.id)
  }
}

