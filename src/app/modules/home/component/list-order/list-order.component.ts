import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {map} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

import {DaterangepickerDirective} from "ngx-daterangepicker-material";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {Invoice} from "@models/invoice.model";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import type {DropdownInterface, DropdownOptions} from "flowbite";
import {Dropdown, initFlowbite} from 'flowbite'
import {SearchService} from "@core/services/bussiness-logic/search.service";
import dayjs from 'dayjs/esm';
import {ColDef, FirstDataRenderedEvent, GridOptions, GridReadyEvent, ValueFormatterParams} from "ag-grid-community";
import {ButtonsCellRender} from "@modules/home/component/list-order/buttons-cell-render/buttons-cell-render";
import {BadgeCellRender} from "@modules/home/component/badge-cell-render/badge-cell-render";
import {AuthService} from "@core/services/api/auth.service";
import {TableCellRender} from "@modules/home/component/table-cell-render/table-cell-render";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {OperationType} from "@models/operation-type";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import moment from "moment";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {CellRenderPaid} from "@modules/home/component/list-order/cell-render-paid/cell-render-paid";
import {Table} from "@models/table.model";
import {DateRange} from "@angular/material/datepicker";
import {User} from "@models/user.model";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {OrdersStore} from "@core/store/orders.store";
import {AgGridAngular} from "ag-grid-angular";
import {ButtonDateRangeComponent} from "@modules/home/component/button-date-range/button-date-range.component";
import {FormsModule} from "@angular/forms";
import {SelectTableComponent} from "@modules/home/component/list-order/select-table/select-table.component";

declare var DateRangePicker: any;

@Component({
  selector: 'app-list-order',
  standalone: true,
  templateUrl: './list-order.component.html',
  imports: [
    AgGridAngular,
    ButtonDateRangeComponent,
    FormsModule,
    SelectTableComponent
  ],
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent extends AbstractInstanceClass implements OnInit, AfterViewInit {
  @ViewChild(DaterangepickerDirective, {static: false}) pickerDirective?: DaterangepickerDirective;

  loading: boolean = true;

  public rowData: undefined | Invoice[] = [];
  public columnDefs: undefined | ColDef[] = [];
  $targetEl?: HTMLElement;
  $triggerEl?: HTMLElement;
  selectMovement: number = 0;

  ordersStore = inject(OrdersStore);

  gridOptions: GridOptions<any> | undefined = {
    columnDefs: [
      {
        headerName: 'TABLE', cellRenderer: TableCellRender, sortable: true, filter: false,
        cellClass: "flex justify-center", minWidth: 40,
        headerTooltip: "Table"
      },
      {
        headerName: 'ORDER', field: 'receiptNumber', sortable: true, filter: false, headerTooltip: "Order",
        minWidth: 100
      },
      {
        headerName: 'TOTAL', field: 'total', valueFormatter: this.AmountFormat, sortable: true, headerTooltip: "Total",
        minWidth: 100, maxWidth: 100,
      },
      {
        headerName: 'STATUS', cellRenderer: BadgeCellRender, sortable: true, headerTooltip: "Status",
        minWidth: 100
      },
      {
        headerName: 'DINING FOR', field: 'diningFor', sortable: true, filter: true, headerTooltip: "Dining for",
        minWidth: 100
      },
      {
        headerName: 'DATE', field: 'date', valueFormatter: this.DateFormat, sortable: true, headerTooltip: "Date",
        minWidth: 100
      },
      {
        headerName: 'Paid',
        minWidth: 100, cellRenderer: CellRenderPaid, headerTooltip: "Actions"
      },
      {
        headerName: 'USER',
        field: 'applicationUserName',
        valueFormatter: this.UserFormat,
        sortable: true,
        headerTooltip: "User",
      },
      {
        minWidth: 450, maxWidth: 450, cellRenderer: ButtonsCellRender, headerTooltip: "Actions"
      }
    ]
  };
  protected readonly InvoiceStatus = InvoiceStatus;
  protected readonly RangeDateOperation = RangeDateOperation;
  private invoiceStatus: undefined | InvoiceStatus = InvoiceStatus.IN_HOLD;
  private userList: User[] = [];

  constructor(public invoiceService: InvoiceService,
              private dialogService: DialogService,
              private authService: AuthService,
              private router: Router,
              private searchService: SearchService,
              private operationService: OperationsService,
              public varGlobalService: VariableGlobalService,
              public dataStore: DataStorageService,
              private route: ActivatedRoute) {
    super();
    initFlowbite();
    this.searchService.setActivePage(PageSidebarEnum.ORDERS)
  }

  ngAfterViewInit(): void {
    this.$targetEl = document.getElementById('dropdownToggle')!;

    // set the element that trigger the dropdown menu on click
    this.$triggerEl = document.getElementById('dropdownToggleButton')!;

    // options with default values
    const options: DropdownOptions = {
      placement: 'bottom',
      triggerType: 'click',
      offsetSkidding: 0,
      offsetDistance: 10,
      delay: 300,

      onHide: () => {
        console.log('dropdown has been hidden');
      },
      onShow: () => {
        console.log('dropdown has been shown');
      },
      onToggle: () => {
        console.log('dropdown has been toggled');
      }
    };

    const dropdown: DropdownInterface = new Dropdown(this.$targetEl, this.$triggerEl, options);

  }

  override ngOnInit(): void {

    this.route.params.subscribe((param: any) => {
      this.invoiceStatus = param['id']
    });

    /* Gel list user */

    this.dataStore.getApplicationUsers()
      .subscribe((next: User[]) => {
        this.userList = next;
        this.onDateUpdate();
      }, error => {
        this.dialogService.openGenericInfo("Error", error)
      })
  }

  private DateFormat(params: ValueFormatterParams) {
    return moment(params.value).format("MM/DD/YYYY")
  }

  private UserFormat(params: ValueFormatterParams) {
    return params.value ? params.value : "Admin"
  }

  onBackOrder() {
    this.router.navigateByUrl("/home/layout/invoice/departaments");
  }

  selectedAll($event: Event) {
    /*
    (this.selectMovement) ?
      this.invoiceService.selectionModel.select(...this.invoiceService.items) :
      this.invoiceService.selectionModel.clear();
    */
    (this.selectMovement) ?
      this.ordersStore.allInvoiceStatus() : this.ordersStore.clearInvoiceStatus();

    this.onDateUpdate();
  }

  onRefreshData(startDate: string, endDate: string) {

    this.loading = true;
    this.invoiceService
      .getInvoiceDateRange(startDate, endDate, 0, 0)
      .pipe(map((items: Invoice[]) => {
        const roles: UserrolEnum[] = [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR];

        if (!roles.includes(this.authService.token.rol!)) {
          items = items.filter((item: Invoice) => {
            return item.applicationUserId === this.authService.token.user_id ||
                   item.order!.table!.posUserId === this.authService.token.user_id
          })
        }
        return items;
      }))
      .pipe(map((items: Invoice[]) => {
        let invoiceFilter: Invoice[] = [];
        this.ordersStore.invoiceStatus().forEach(m => {
          switch (m) {
            case 4:
              invoiceFilter.push(...items.filter(f => f.status === m && !f.isRefund))
              break;
            case 9:
              invoiceFilter.push(...items.filter(f => f.isRefund))
              break;
            default:
              invoiceFilter.push(...items.filter(f => f.status === m))
              break;
          }
        });

        if (!!this.ordersStore.table()) {
          invoiceFilter = invoiceFilter.filter(p => p.order!.tableId! === this.ordersStore.table()!.id)
        }

        invoiceFilter.forEach( (inv : Invoice) => {

          let item = this.userList.filter( u => u.id === inv.applicationUserId );

          if (item.length > 0)
          {
            inv.applicationUserName = item[0].userName
          }
        });

       return invoiceFilter;
      }))
      .subscribe((items: Invoice[]) => {
        console.log("list of orders : ", items);

        this.rowData = items.sort(function (a: Invoice, b: Invoice) {
          const date2 = a.date!/*.toString().split('-').join('')*/;
          const date1 = b.date!/*.toString().split('-').join('')*/;
          return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
        })

        //this.rowData = items;
        this.loading = false;
      }, (error: any) => {
        this.loading = false;
        this.dialogService.openGenericInfo("Error", error);
      });
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  changeSelected(item: OperationType) {
    this.invoiceService?.selectionModel!.toggle(item);
    this.onDateUpdate();
  }

  evChangeDateRange($event: DateRange<Date>) {
    //debugger;
    this.ordersStore.updateDateRange($event);
    console.log("Interval to date ->  ",this.ordersStore.dateRange())
    this.onDateUpdate();
  }

  onDateUpdate($event?: any) {
    this.onRefreshData(
      moment(this.ordersStore.dateRange().start).format("MM-DD-yyyy HH:mm"),
      moment(this.ordersStore.dateRange().end).format("MM-DD-yyyy HH:mm"));
  }

  evChangeSelectedTable($event: Table | null) {
    this.ordersStore.updateTable($event);
    this.onDateUpdate(null);
  }

  changeStatusInvoice(id: number) {
    this.ordersStore.updateInvoiceStatus(id)
    this.onDateUpdate();
  }
}

