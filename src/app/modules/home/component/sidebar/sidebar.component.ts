import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment'
import {ActivatedRoute, Router} from "@angular/router";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {FileService} from "@core/services/bussiness-logic/file.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {CompanyType} from "@core/utils/company-type.enum";
import {CardReadmeComponent} from "@modules/home/component/card-readme/card-readme.component";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {
  CalculatorCashOutInComponent
} from "@modules/home/component/calculator-cash-out-in/calculator-cash-out-in.component";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {AuthService} from "@core/services/api/auth.service";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {MatDialog} from "@angular/material/dialog";
import {AssignTableComponent} from "@modules/home/component/assign-table/assign-table.component";
import {ETXType} from "@core/utils/delivery.enum";
import {Order} from "@models/order.model";
import {StatusTable} from "@core/utils/operations";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent extends AbstractInstanceClass implements OnInit {
  isActive: number = 0;
  version: string = '';
  isDiableButton: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchService: SearchService,
              private cashService: CashService,
              private departProdService: DepartProductService,
              private invoiceService: InvoiceService,
              private authService: AuthService,
              private dialog: MatDialog,
              private tableService: TablesService,
              private dialogService: DialogService,
              private operationService: OperationsService,
              private fileReaderService: FileService) {
    super();
  }

  get isAdministrator() {
    const adminRol = [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR]

    return adminRol.includes(this.authService?.token?.rol);
  }

  override ngOnInit(): void {
    this.version = `Version ${environment.version}`;

    this.departProdService.loadData();

    this.sub$.push(this.searchService.activatedObservable().subscribe((actived: number) => {
      this.isActive = actived
    }));

    this.sub$.push(this.searchService.buttonsObservable().subscribe((enable: boolean) => {
      this.changeStateButtons(enable)
    }));

    (this.cashService.config!.sysConfig!.companyType! === CompanyType.RESTAURANT) ?
      this.router.navigateByUrl("/home/layout/tables") :
      this.router.navigateByUrl("/home/layout/invoice/departaments");
  }

  onShowReadme() {
    this.dialogService.dialog.open(CardReadmeComponent, {
      width: '640px', height: '600px',
      data: {},
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
    })
  }

  CashOutIn() {

    this.dialog.open(CalculatorCashOutInComponent, {
      width: '880px', height: '650px', data: {
        amountSubTotal: 130,
        amountBalance: 135
      },
      disableClose: true
    }).afterClosed().subscribe((next: any) => {
      if (next) {
        const dialog =
          this.dialogService.openDialog(ProgressSpinnerComponent, "", "289px", "316px");

        this.invoiceService.addPaidOut(next.cash, next.motion, next.typeOperation, this.authService.token!.user_id!)
          .subscribe(next => {
            dialog.close()
          }, error => {
            dialog.close();
            this.dialogService.openGenericInfo("Error", error)
          })
      }
    });

  }

  createAssignTable() {
    this.dialog.open(AssignTableComponent, {
      width: '820px', height: '613px', data: {},
      disableClose: true
    }).afterClosed().subscribe(next => {
      if (next) {
        console.log(next);
        this.invoiceService.createInvoice(ETXType.DINEIN, next!.table!.id, i => {
          this.invoiceService.setDineIn(next!.table!).subscribe((order: Order) => {
            this.invoiceService.txType = ETXType.DINEIN;
            this.invoiceService.order = order;
            this.tableService.setTableSelected(next!.table!);
            this.tableService.setTableStatus(StatusTable.BUSY);
            this.invoiceService.setOrderEmit(order);
            this.router.navigateByUrl("/home/layout/invoice/departaments");
          }, error => {
            this.dialogService.openGenericInfo("Error", error)
          });
        });
      }
    });
  }

  createToGo() {
    this.invoiceService.createInvoice(undefined, undefined, i => {
      this.invoiceService.txType = ETXType.FAST_FOOD;
      this.router.navigateByUrl("/home/layout/invoice/departaments");
    });
  }

  newOrder() {
    /*
    this.dialogService.openGenericInfo('Confirmation', 'Are you sure to create a new invoice?',
      null, true)
      .afterClosed().subscribe((next: any) => {
      console.log(next);
      if (next !== undefined && next.confirm) {
   */

    const status = [InvoiceStatus.IN_PROGRESS, InvoiceStatus.CREATED];
    if (this.invoiceService.invoice &&
      this.invoiceService.invoice!.productOrders!.length! > 0 &&
      status.includes(this.invoiceService.invoice!.status!)) {
      if (this.invoiceService.invoice!.isRefund!) {
        this.invoiceService.removeInvoice();
        (this.invoiceService.txType === ETXType.DINEIN) ? this.createAssignTable() : this.createToGo();
      } else {
        this.operationService
          .inProgressOp(this.authService.token!.username!,
            () => {
              (this.invoiceService.txType === ETXType.DINEIN) ?
                this.createAssignTable() : this.createToGo();
            });
      }
    } else {
      (this.invoiceService.txType === ETXType.DINEIN) ?
        this.createAssignTable() : this.createToGo();
    }
    /*
        }
      });
    */
  }

  private changeStateButtons(enable: boolean) {
    this.isDiableButton = enable;
  }

  onNotSale() {
    this.operationService.notSale()
  }
}
