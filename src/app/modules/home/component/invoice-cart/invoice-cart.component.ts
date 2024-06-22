import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {Invoice} from '@models/invoice.model';
import {Router} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import {AssignTableComponent} from "@modules/home/component/assign-table/assign-table.component";
import {ETXType} from "@core/utils/delivery.enum";
import {ProductOrder} from "@models/product-order.model";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {InformationType} from "@core/utils/information-type.enum";
import {Table} from "@models/table.model";
import {Order} from "@models/order.model";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";
import {AddNoteDueComponent} from "@modules/home/component/add-note-due/add-note-due.component";
import {StatusTable} from "@core/utils/operations";
import {concatMap, last} from "rxjs";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {animate} from "@angular/animations";
import {fadeInLeftAnimation} from "@core/lib";
import {
  SearchCustomerComponent
} from "@modules/home/component/list-customers/search-customer/search-customer.component";
import {Customer} from "@models/customer.model";
import {
  CardItemsOrderComponent
} from "@modules/home/component/invoice-cart/card-items-order/card-items-order.component";

@Component({
  selector: 'app-invoice-cart',
  templateUrl: './invoice-cart.component.html',
  styleUrls: ['./invoice-cart.component.css'],
  /*
  animations: [
    fadeInLeftAnimation(),
  ]
  */
})

export class InvoiceCartComponent extends AbstractInstanceClass implements OnInit, AfterViewInit, OnDestroy {

  public Invoice?: Invoice;
  public isMoreOptions: boolean = false;
  public table!: Table;
  public numberInvoice!: string;
  protected readonly ETXType = ETXType;
  protected readonly animate = animate;
  protected readonly last = last;

  @ViewChild('cardItemsOrder', {static: true}) cardItemsOrder : CardItemsOrderComponent | undefined;

  constructor(private dialog: MatDialog,
              public invoiceService: InvoiceService,
              private colorsService: ColorsService,
              private dialogService: DialogService,
              private configService: ConfigurationService,
              private tableService: TablesService,
              private operationService: OperationsService,
              //private cd: ChangeDetectorRef,
              private router: Router) {
    super();
  }

  get enableButtons() {
    return this.Invoice?.productOrders?.length! === 0 ||
      this.invoiceService.invoice === undefined || this.invoiceService.invoice === null;
  }

  get getArrayChairs() {

    return (this.invoiceService.getInvoiceTable! && this.invoiceService.getInvoiceTable!.chairNumber! > 0) ?
      Array(this.invoiceService.getInvoiceTable.chairNumber) :
      [];
  }

  get disableButtonHold() {
    return this.invoiceService.disableHold ||
      this.invoiceService.invoice?.isRefund! ||
      this.invoiceService.invoice?.isRefundSale!;
  }

  get disableCheckout() {
    return this.invoiceService!.disableCheckout
  }

  get disableVoid() {
    return this.invoiceService.disableVoid
  }

  get checkDinein() {
    return !(this.invoiceService.txType! === ETXType.DINEIN);
  }

  get paymentStatus() {
    const status =
      [InvoiceStatus.PAID, InvoiceStatus.CANCEL, InvoiceStatus.REFUND]
    return !status.includes(this.invoiceService.invoice?.status!)
  }

  get isNote() {
    return this.Invoice?.note && this.Invoice?.note!.trim() != ''
  }

  get isDiscount() {
    return this.Invoice?.isDiscount
  }

  /* Check type services */
  get disableDineIn() {
    return !this.configService.sysConfig.allowDineIn;
  }

  get disablePickup() {
    return !this.configService.sysConfig.allowPickUp;
  }

  get disableDelivery() {
    return !this.configService.sysConfig.allowDelivery;
  }

  get disableToGo() {
    return !this.configService.sysConfig.allowToGo;
  }

  get sumDiscount() {
    return this.invoiceService!.invoice!.productOrders!
      .reduce((a: number, p: ProductOrder) => {
        return a + p.saved!
      }, 0).toFixed(2);
  }

  protected readonly InvoiceService = InvoiceService;

  ngAfterViewInit(): void {
    //this.cd.detectChanges();
    this.sub$.push(this.invoiceService.getOrderObservable$().subscribe((order: Order | undefined) => {
      this.table = this.invoiceService.getInvoiceTable;
    }));
  }

  override ngOnInit(): void {
    this.sub$.push(this.invoiceService.evCreateInvoice.subscribe((ev: boolean) => {
      this.numberInvoice = this.invoiceService.receiptNumber
    }));

    this.sub$.push(this.invoiceService.evDelAllProds.subscribe(ev => {
      this.evDelAllProduct()
    }));

    this.sub$.push(this.invoiceService.getInvoice$().subscribe((invoice: Invoice) => {
      this.Invoice = invoice;
    }));

    this.sub$.push(this.invoiceService.evUpdateProds.subscribe((invoice: Invoice) => {
       this.Invoice = this.invoiceService.invoice!;
    }));

  }

  cancelInvoice() {
    this.operationService.void();
  }

  checkoutOrder() {
    if (this.invoiceService.txType === ETXType.DINEIN && !this.invoiceService.getInvoiceTable) {
      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Information", "Please assign a table for this" +
        " operation",
        undefined, DialogConfirm.BTN_CLOSE);
      return;
    }
    this.operationService.subTotal();
    this.router
      .navigateByUrl('/home/layout/orders/order/' + this.invoiceService.invoice!.receiptNumber);
  }

  onClearOrder() {
    this.invoiceService.delProductsFromInvoive(this.invoiceService.invoice!.productOrders);
  }

  HoldInvoice() {
    if (this.invoiceService!.invoice?.status! != InvoiceStatus.PAID) {
      const dialogInfoEvents =
        this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, undefined,
          'Please wait a moment while the process takes place...', undefined, DialogConfirm.BTN_NONE);

      if (this.configService.sysConfig.printHold) this.onPrintInvoice()

      this.invoiceService.holdOrder().subscribe((next: any) => {
        dialogInfoEvents!.close();
        this.invoiceService.removeInvoice();
        this.isMoreOptions = false;
        this.operationService.sendNotificationInvoicePending(true);
      }, error => {
        this.dialogService.openGenericInfo(InformationType.INFO, error);
      })
    } else {
      this.dialogService.openGenericInfo(InformationType.INFO, "")
    }
    this.onReturnMenu();
  }

  onPrintPreparedInvoice(option: number) {
    this.operationService.printPepared(option, this.invoiceService.invoice?.prepareNote);
    this.onReturnMenu();
  }

  onPrintInvoice() {
    this.operationService.reprint();
    this.onReturnMenu();
    //this.invoiceService.print(this.invoiceService!.invoice!)
  }

  onAssignTable() {
    const statusInvoice = [
      InvoiceStatus.PAID,
      InvoiceStatus.PENDENT_FOR_PAYMENT,
      InvoiceStatus.PENDENT_FOR_AUTHORIZATION,
      InvoiceStatus.CANCEL];

    if (!statusInvoice.includes(this.invoiceService.invoice?.status!) && this.invoiceService.txType === ETXType.DINEIN) {
      this.dialog.open(AssignTableComponent, {
        width: '820px', height: '613px', data: {},
        disableClose: true
      }).afterClosed().subscribe(next => {
        if (next) {
          console.log(next);
          this.invoiceService.createInvoice(ETXType.DINEIN, next!.table!.id, i => {
            this.invoiceService.setDineIn(next!.table!).subscribe((nextOrder: any) => {
              this.invoiceService.txType = ETXType.DINEIN;
              this.invoiceService.order = nextOrder;
              this.tableService.setTableSelected(next!.table!);
              this.tableService.setTableStatus(StatusTable.BUSY);
              this.invoiceService.setOrderEmit(nextOrder);
            }, error => {
              this.dialogService.openGenericInfo("error", error)
            })
          })
        }
      });
    } else {
      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, undefined, "You cannot add products to this" +
        " order...", undefined, DialogConfirm.BTN_CLOSE);
    }
  }

  onSelectedPostion(position: number) {
    this.invoiceService.positionTable = position;
  }

  onETXType(etxType: ETXType) {
    //const status = [InvoiceStatus.REFUND, InvoiceStatus.CANCEL, InvoiceStatus.PAID];

    //if (this.invoiceService.invoice === undefined || !status.includes(this.invoiceService.invoice!.status))
    //{
    this.invoiceService.setOrderEmit(undefined);
    this.invoiceService.txType = etxType;
    //}
  }

  getColor(position: number) {
    return "background: " + this.colorsService.getColor(position);
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  onGroupByProducts(items: ProductOrder[]) {
    const value = this.groupBy(items, i => i.position);
    const look = Object.keys(value);//.sort(this.compareNumbers);
    return look.map((str) => {
      return parseInt(str)
    });
  }

  getFilterProducts(productOrders: ProductOrder[], position: number) {
    return productOrders.filter(p => p.position === position);
  }

  onReturnMenu() {
    this.isMoreOptions = !this.isMoreOptions;
  }

  async writeNote(note: string) {
    return await this.invoiceService
      .addNoteInvoice(this.invoiceService.invoice!.receiptNumber, note);
  }

  onAddNote() {
    this.dialogService.dialog.open(AddNoteDueComponent, {
      width: '520px', height: '420px',
      data: {
        noteInvoice: this.invoiceService.invoice?.note!,
        notePrepared: this.invoiceService.invoice?.prepareNote!
      },
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
      if (next) {
        const dialog =
          this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, undefined,
            'Please wait while your note is saved', undefined, DialogConfirm.BTN_NONE);


        const noteInvoiceObservable = this.invoiceService
          .addNoteInvoice(this.invoiceService.invoice!.receiptNumber, next!.noteInvoice!);

        const notePreparedObservable = this.invoiceService
          .addPrepareNoteInvoice(this.invoiceService.invoice!.receiptNumber, next!.notePrepared!);

        noteInvoiceObservable.pipe(
          concatMap((next) => {
            console.log(next); // Imprime "Hola"
            if (next) {
              this.invoiceService.invoice!.note = next.note;
            }
            return notePreparedObservable;
          })
        ).subscribe((next) => {
          console.log(next); // Imprime "Hola"
          if (next) {
            this.invoiceService.invoice!.prepareNote = next.prepareNote;
          }
          dialog!.close();
        }, error => {
          dialog!.close();
          this.dialogService.openGenericInfo("Error", error)
        });
      }
    });
  }

  onAddDiscount() {
    if (this.invoiceService!.invoice!.productOrders! && this.invoiceService!.invoice!.productOrders!.length > 0) {

      const maxValue = this.invoiceService!.invoice!.productOrders!
        .reduce((a: number, p: ProductOrder) => {
          return a + p.total
        }, 0);

      this.dialogService.openDialogCalculatorDiscount(maxValue).subscribe((next: any) => {
        if (next) {
          this.operationService.applyDiscountInvoice(next.amount, next.operation)
        }
      });
    }
  }

  private evDelAllProduct() {
    this.invoiceService.getUpdateInvoice();
  }

  get useCustomer() {
    return this.invoiceService.invoice!.order!.clientId
  }

  onAddCustomer() {
    this.dialogService
      .openDialog(SearchCustomerComponent, "Search customer", "1094px", "670px")
      .afterClosed().subscribe((next: Customer) => {
      if (next) {
        const dialog =
          this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Save information",
            'Please wait while your client is saved', undefined, DialogConfirm.BTN_NONE);

        this.invoiceService.aggregateCustomerInvoice(next.id).subscribe((invoice: Invoice) => {
          dialog?.close();
          this.invoiceService.setInvoice(invoice);
          //this.invoiceService.invoice!.order!.clientId = invoice.order?.clientId
        }, error => {
          dialog?.close();
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error, "")
        });
      }
    })
  }
}
