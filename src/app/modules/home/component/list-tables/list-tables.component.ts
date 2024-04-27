import {AfterViewInit, Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import type {DropdownInterface} from "flowbite";
import {Dropdown} from "flowbite";
import {Table} from "@models/table.model";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {AuthService} from "@core/services/api/auth.service";
import {LocalLayout} from "@models/local.layout.model";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {UserList} from "@models/userList";
import {Router} from "@angular/router";
import {LocalLayoutService} from "@core/services/bussiness-logic/local-layout.service";
import {map} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {ETXType} from "@core/utils/delivery.enum";
import {Order} from "@models/order.model";
import {StatusTable} from "@core/utils/operations";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {PaymentStatus} from "@core/utils/payment-status.enum";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {DataStorageService} from "@core/services/api/data-storage.service";

@Component({
  selector: 'app-list-tables',
  templateUrl: './list-tables.component.html',
  styleUrls: ['./list-tables.component.css']
})
export class ListTablesComponent extends AbstractInstanceClass implements AfterViewInit, OnInit {

  @ViewChild("selectStatus") selectStatus?: ElementRef;
  @ViewChild("selectPosUser") selectPosUser?: ElementRef;
  @ViewChild("dropdownUserButton", {static: true}) dropdownUserButton?: ElementRef;

  //tables: Table[] = [];
  localLayout?: LocalLayout[] = [];
  activeLayout?: LocalLayout;
  layoutFilter: string = "-99";
  userList: UserList[] = [];

  filterUser: number = -99;

  isUserAdmin: boolean = false;

  $targetElUser?: HTMLElement;
  $triggerElUser?: HTMLElement;

  $targetElStatus?: HTMLElement;
  $triggerElStatus?: HTMLElement;

  dropdownUser?: DropdownInterface;
  dropdownStatus?: DropdownInterface;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tablesService: TablesService,
    private invoiceService: InvoiceService,
    private layoutService: LocalLayoutService,
    private searchService: SearchService,
    private sanitizer: DomSanitizer,
    private dialogService: DialogService,
    private operationService: OperationsService,
  ) {
    super();

    this.searchService.setActivePage(PageSidebarEnum.TABLES)

  }

  get isStatusAndAsignUser() {
    return this.tablesService.getTableSelected!.length != 0;
  }

  get isPlaceOrder() {
    return this.tablesService.getTableSelected!.length === 1;
  }

  get enableButtonHold() {
    const invStatus = [InvoiceStatus.CANCEL, InvoiceStatus.PAID, InvoiceStatus.REFUND];
    const payStatus = [PaymentStatus.REFUND, PaymentStatus.VOID];

    return invStatus.includes(this.invoiceService.invoice!.status!) ||
      payStatus.includes(this.invoiceService.invoice!.paymentStatus!)
  }

  ngAfterViewInit(): void {
    this.$targetElUser = document.getElementById('dropdownUser')!;
    this.$triggerElUser = document.getElementById('dropdownUserButton')!;

    this.dropdownUser = new Dropdown(this.$targetElUser, this.$triggerElUser);

    this.$targetElStatus = document.getElementById('dropdownStatus')!;
    this.$triggerElStatus = document.getElementById('dropdownStatusButton')!;

    this.dropdownStatus = new Dropdown(this.$targetElStatus, this.$triggerElStatus);
  }

  override ngOnInit(): void {
    this.tablesService.clearTableSelected();
    this.searchService.clearSearch();
    this.isUserAdmin = (this.authService.token.rol === UserrolEnum.ADMIN) ||
      (this.authService.token.rol === UserrolEnum.SUPERVISOR);

    if (this.isUserAdmin) {
      this.authService.getUsersList()
        .pipe(map((user: UserList[]) => {
          user.forEach((item, index) => {
            item.imageBase64 = item.image != undefined ?
              this.sanitizer.sanitize(SecurityContext.NONE,
                this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + item.image))
              : undefined
          })
          return user;
        }))
        .subscribe((next: UserList[]) => {
          console.log("User list: ", next);
          this.userList = next;
        }, error => {
          this.dialogService.openGenericInfo("Error", error)
        })
    }

    this.onReadTables();
  }

  onReadTables() {
    console.log("Read local layout ");

    this.tablesService.updateStateTable().subscribe((nextUpdate: any) => {

      let readLayout = !this.isUserAdmin ?
        this.layoutService.getLocalLayoutByUser(this.authService.token!.user_id) :
        this.layoutService.getLocalLayout();

      readLayout
        .pipe(map((next: LocalLayout[]) => {
          if (!this.isUserAdmin) {
            next.forEach(l => {
              l.tables = l.tables.filter(t => t.status != 0)
            })
          }
          return next;
        }))
        .subscribe((next: LocalLayout[]) => {
          console.log(next);
          this.localLayout = next;
          this.activeLayout = undefined;
          //this.onReadTableLayoutByUser();
        }, error => {
          console.log(error);
          this.dialogService.openGenericInfo("Error", error)
        });
      this.operationService.resetInactivity(true);

    });
  }

  /* Add Tables */
  onNewTable($event: Table) {
    $event.localLayoutId = this.activeLayout?.id;
    this.tablesService.setTable($event).subscribe((next: Table) => {
      console.log("Add table: ", next);
      if (next!.localLayout) {
        this.activeLayout!.tables.push(next);
        this.onLocalLayout(next!.localLayout!);
      }
    }, (error: any) => this.dialogService.openGenericInfo("Error", error));
    this.operationService.resetInactivity(true);
  }

  onAssignTableProperty(param: any, field: number = 0) {
    this.operationService.resetInactivity(true);
    this.dropdownUser!.hide();
    this.dropdownStatus!.hide();
    this.tablesService.getTableSelected.forEach(p => {
      if (p.selected) {
        switch (field) {
          case 0 :
            p.posUserId = param
            break;
          case 1 :
            p.status = param
            break;
        }
      }
    });
    this.tablesService.setTableAll(this.tablesService.getTableSelected).subscribe((next: any) => {
      console.log("Update tables : ", next);
      this.tablesService.pushTablesUpdate(next);
      this.tablesService.clearTableSelected();
    }, (error: any) => {
      console.log(error)
    });
  }

  /*
  onReadTableLayoutByUser() {
    let readTables = !this.isUserAdmin ?
      this.tablesService.getTablesLocationUser(this.activeLayout?.id!, this.authService!.token!.user_id!) :
      this.tablesService.getTablesLocation(this.activeLayout?.id!);

    this.tablesService.setLayout(this.activeLayout!);

    readTables.subscribe((next: Table[]) => {
      console.log(next);
      this.tables = next;
    }, (error: any) => {
      console.log(error);
      this.cashService.openGenericInfo("Error", error)
    });
    this.operationService.resetInactivity(true);
  }
  */

  onLocalLayout($event: LocalLayout) {
    this.activeLayout!.totalTableNumber = $event.totalTableNumber;
    this.activeLayout!.usedTableNumber = $event.usedTableNumber;

    this.activeLayout!.totalChairNumber = $event.totalChairNumber;
    this.activeLayout!.usedChairNumber = $event.usedChairNumber;
  }

  onChangeLocalLayout(event: any) {
    console.log(event.target.value);
    if (event.target.value.trim() === "-99") {
      this.activeLayout = undefined;
      this.layoutFilter = "-99";
      this.tablesService.setLayout(undefined);
    } else {
      this.localLayout!.forEach(p => {
        if (p.id?.trim() === event.target.value.trim()) {
          this.activeLayout = p;
          this.tablesService.setLayout(p);
          this.layoutFilter = p.id!
          //this.onReadTableLayoutByUser();
        }
      })
    }
  }

  onChangeUser($event: any) {
    console.log($event)
    this.filterUser = $event.target.value;
  }

  onUpdateLayout(count: number) {
    this.activeLayout!.usedChairNumber = this.activeLayout!.usedChairNumber! + count
  }

  onCreateInvoiveFastFood() {
    this.invoiceService.removeInvoice();

    this.invoiceService.createInvoice(undefined, undefined, i => {
      this.invoiceService.txType = ETXType.FAST_FOOD;
      this.router.navigateByUrl("/home/layout/invoice/departaments");
    });
  }

  onProcessTable() {
    if (this.tablesService.getTableSelected!.length === 1) {

      const layoutSelected =
        this.localLayout?.filter(l => l.id === this.tablesService.getTableSelected[0]!.localLayoutId)

      if (layoutSelected!.length === 1 && layoutSelected![0]!.layoutType === 3) {
        if (this.invoiceService.invoice?.productOrders?.length! > 0) {
          this.operationService.inProgressOp(this.authService.token!.username!, () => {
            this.onCreateInvoiveFastFood();
          });
        } else {
          this.onCreateInvoiveFastFood();
        }
      } else {
        //this.invoiceService.removeInvoice();
        this.invoiceService.createInvoice(ETXType.DINEIN, this.tablesService.getTableSelected[0]!.id, i => {
          this.invoiceService.setDineIn(this.tablesService.getTableSelected[0]!).subscribe((next: Order) => {
            this.invoiceService.txType = ETXType.DINEIN;
            this.invoiceService.order = next;
            this.tablesService.setTableStatus(StatusTable.BUSY);
            this.router.navigateByUrl("/home/layout/invoice/departaments");
          }, error => {
            this.dialogService.openGenericInfo("Error", error)
          });
          5
        });

      }
    }
  }

  onPlaceOrder() {
    ((this.invoiceService.invoice?.productOrders?.length! > 0) && !this.enableButtonHold) ?
      this.operationService.inProgressOp(this.authService.token!.username!,
        () => {
          this.onProcessTable()
        }) : this.onProcessTable()
  }
}
