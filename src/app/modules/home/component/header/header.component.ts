import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {debounceTime, fromEvent, Subscription, tap} from "rxjs";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {ClockService} from "@core/utils/clock.service";
import {Router} from "@angular/router";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {map} from "rxjs/operators";
import {SearchService} from "@core/services/bussiness-logic/search.service";

import type {DropdownOptions} from "flowbite";
import {Dropdown} from "flowbite";

import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {ETXType} from "@core/utils/delivery.enum";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {CompanyType} from "@core/utils/company-type.enum";
import {StatusTable} from "@core/utils/operations";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {WebsocketService} from "@core/services/api/websocket.service";
import {IndividualConfig, ToastrService} from "ngx-toastr";
import {TypeToastrEnum} from "@core/utils/type.toastr.enum";
import {SchedulerNotification} from "@models/scheduler-notification.model";
import {SchedulerService} from "@core/services/bussiness-logic/scheduler.service";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {ConfirmPaymentComponent} from "@modules/home/component/confirm-payment/confirm-payment.component";

export interface toastPayload {
  message: string;
  title: string;
  ic: IndividualConfig;
  type: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("inputSearch", {static: true}) inputSearch!: ElementRef;
  @ViewChild('example', {static: true}) example!: ElementRef;

  subscription!: Subscription;

  public numberInvoice!: string;
  public dateClock: Date = new Date();
  selected: any;
  today: any;
  private subscriptions: Subscription[] = [];
  private $targetEl?: HTMLElement;
  private $triggerEl?: HTMLElement;
  private $targetElSearch?: HTMLElement;
  private $triggerElSearch?: HTMLElement;

  constructor(private invoiceService: InvoiceService,
              private clockService: ClockService,
              public authService: AuthService,
              private cashService: CashService,
              private operationService: OperationsService,
              private searchService: SearchService,
              private tableService: TablesService,
              private dialogService: DialogService,
              private toastr: ToastrService,
              private ws: WebsocketService,
              private schedulerService: SchedulerService,
              public departProduct: DepartProductService,
              private cd: ChangeDetectorRef,
              private router: Router) {
    //initFlowbite();
  }

  ngAfterViewInit(): void {
    // set the dropdown menu element
    this.$targetEl = document.getElementById('dropdownAvatarName')!;

    // set the element that trigger the dropdown menu on click
    this.$triggerEl = document.getElementById('dropdownAvatarNameButton')!;

    this.$targetElSearch = document.getElementById('dropdownSearch')!;

    // set the element that trigger the dropdown menu on click
    this.$triggerElSearch = document.getElementById('dropdownSearchButton')!;

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 20,
      offsetDistance: 10,

      delay: 300,
      onHide: () => {
        //console.log('dropdown has been hidden');
      },
      onShow: () => {
        //console.log('dropdown has been shown');
      },
      onToggle: () => {
        //console.log('dropdown has been toggled');
      }
    };

    //dropdown: DropdownInterface
    new Dropdown(this.$targetEl!, this.$triggerEl!, options);
    //new Dropdown(this.$targetElSearch!, this.$triggerElSearch!, options);
  }

  ngOnInit(): void {
    this.subscriptions.push(this.invoiceService.evCreateInvoice
      .subscribe((ev: boolean) => {
        this.numberInvoice = this.invoiceService.receiptNumber
      }));

    /*
    this.clockService.getDate.subscribe(
      (arg: Date) => {
        this.dateClock = arg;
        console.log("Get Date now ", arg)
        //this.cd.detectChanges();
        this.cd.markForCheck()
      }
    );
    */

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
        this.searchService.searchText(search);
      });

    this.subscriptions.push(this.searchService.evChangeSearch
      .subscribe((search: string) => {
        this.inputSearch!.nativeElement.value = search
      }));

    this.subscriptions.push(this.ws.evScheduler.subscribe((data: SchedulerNotification[]) => this.evSchedulerNotification(data)));
  }

  InProgressOrder(userName?: string) {
    this.operationService.inProgressOp(this.authService.token!.username, () => {
      this.tableService.setTableStatus(StatusTable.BUSY);
      this.operationService.logout();
    })
  }

  onLogoutUser() {
    const status = [InvoiceStatus.IN_PROGRESS, InvoiceStatus.CREATED, InvoiceStatus.IN_HOLD];

    if ((!this.invoiceService.invoice || this.invoiceService.invoice!.productOrders!.length! === 0)) {
      //this.invoiceService.removeInvoice();
      this.invoiceService.isCreating = false;
      this.operationService.logout();
    } else {
      if (this.invoiceService.invoice!.isRefund!) {
        this.invoiceService.removeInvoice();
        this.operationService.logout();
      } else {
        this.operationService.logout();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  onModeDark() {
    document.documentElement.classList.toggle("dark")
  }

  getType() {
    return (this.cashService.config.sysConfig.companyType === CompanyType.RESTAURANT) ?
      ETXType.DINEIN : ETXType.FAST_FOOD;
  }

  evSchedulerNotification(data: SchedulerNotification[]) {
    this.cd.detectChanges();

    this.dialogService.toastMessage(TypeToastrEnum.INFO, "Happy Hour Notification");
    data.map(p => {
      this.departProduct.updateScheduler(p);
    });
  }

  forceExecutionScheduler() {
    this.schedulerService.forceExecutionScheduler().subscribe((next: SchedulerNotification[]) => {
      console.log(next);
      if (next.length > 0) {
        next.map(p => {
          this.departProduct.updateScheduler(p);
        });

        this.dialogService.toastMessage(TypeToastrEnum.INFO, "Product update notification received...");
      } else {
        this.dialogService.toastMessage(TypeToastrEnum.INFO, "There are no modifications to the products...");
      }
    })
  }
}
