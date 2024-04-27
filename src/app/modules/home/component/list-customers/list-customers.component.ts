import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {ProgressCircleComponent} from "@modules/home/component/progress-circle/progress-circle.component";
import {AgGridAngular} from "ag-grid-angular";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {
  CellClassParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  SelectionChangedEvent,
  ValueFormatterParams
} from "ag-grid-community";
import {CustomerService} from "@core/services/bussiness-logic/customer.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogType} from "@core/utils/dialog-type.enum";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {
  CellRenderCustomerComponent
} from "@modules/home/component/list-customers/cell-render-customer/cell-render-customer.component";
import {
  CellRenderCustomerButtonComponent
} from "@modules/home/component/list-customers/cell-render-customer-button/cell-render-customer-button.component";
import {DateRangeComponent} from "@modules/home/component/daterange/daterange.component";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {
  RenderCustomerComponent
} from "@modules/home/component/list-customers/render-customer/render-customer.component";
import {AddCustomerComponent} from "@modules/home/component/list-customers/add-customer/add-customer.component";
import {Customer} from "@models/customer.model";
import {getActiveConsumer} from "@angular/core/primitives/signals";
import {TypeToastrEnum} from "@core/utils/type.toastr.enum";
import {zoomIn} from "ng-animate";
import {Overlay} from "@angular/cdk/overlay";
import {CdkPortal, ComponentPortal} from "@angular/cdk/portal";
import {ButtonDateComponent} from "@modules/home/component/button-date/button-date.component";
import {FocusMonitor} from "@angular/cdk/a11y";

@Component({
  standalone: true,
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  imports: [
    ProgressCircleComponent,
    AgGridAngular,
    DateRangeComponent,
    RenderCustomerComponent,
    ButtonDateComponent
  ],
  styleUrls: ['./list-customers.component.css'],
})
export class ListCustomersComponent extends AbstractInstanceClass implements OnInit {


  loadingCustomer: boolean = true;
  public rowData: Customer[] = [];
  public rowDataSearch: Customer[] = [];
  public columnDefs: undefined | ColDef[] = [];
  gridApi!: GridApi;
  selectIdCustomer!: Customer | null;

  protected readonly RangeDateOperation = RangeDateOperation;
  protected readonly getActiveConsumer = getActiveConsumer;

  constructor(
    private searchService: SearchService,
    private customerService: CustomerService,
    private dialogService: DialogService,
    public varGlobalService: VariableGlobalService,
  ) {
    super();
    this.searchService.setActivePage(PageSidebarEnum.CUSTOMERS);
  }

  get getActiveCustomer() {
    return !(this.selectIdCustomer != null);
  }

  onSelectionChanged($event: SelectionChangedEvent<any>) {
    console.log("change selected", $event);
    $event.api.redrawRows()
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  cellStyle(params: CellClassParams<any, any>) {
    return {
      /*color: (params.data.unitInStock < 0) ? '#EA5252' : 'black',*/
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
  }

  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
  }


  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  selectCustomer(customer: Customer): boolean {
    return this.selectIdCustomer === customer;
  }

  onChangeDate(ev: Event) {
    console.log(ev)
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.searchService.clearSearch();

    this.onColumnDefs();
    this.dataCustomer();

    this.sub$.push(
      this.searchService.searchObservable().subscribe((search: string) => {
        this.onFilterTextBoxChanged(search)
      }));
  }

  openDialog(openEdit: boolean, customer?: Customer) {
    this.dialogService.openDialog(AddCustomerComponent, "", "565px", "687px", true,
      {customer, openEdit})
      .afterClosed().subscribe((customer: Customer) => {
      if (customer) {

        const operation = !openEdit
          ? this.customerService.addCustomer(customer)
          : this.customerService.updateCustomer(customer)

        operation.subscribe((newState: Customer[]) => {
          newState.forEach(c => c.firstName = c.name);
          this.rowData = newState;
          this.rowDataSearch = newState;
          this.dialogService.toastMessage(TypeToastrEnum.SUCCESS, "Customer", "Satisfactory operation...")

        }, error => {
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
        })
      }
    })
  }

  onNewCustomer() {
    this.openDialog(false)
  }

  onSelectCustomer($event: Customer) {
    this.selectIdCustomer = $event!
  }

  onUpdateCustomer() {
    this.openDialog(true, this.selectIdCustomer!);
  }

  onDeleteCustomer() {
  }

  private onColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'CUSTOMER NAME', field: 'name', sortable: true,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'PHONE NUMBER', field: 'phone', sortable: false,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'EMAIL ADDRESS', field: 'address', filter: true,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'REVIEW POINT', filter: true, cellStyle: this.cellStyle
      },
      {
        headerName: 'CITY LOCATION', field: 'email', filter: true,
        cellStyle: this.cellStyle
      },
      {
        maxWidth: 150, cellStyle: this.cellStyle,

        cellRendererSelector: (params: ICellRendererParams) => {
          const selectedRow = params.api.getSelectedRows()[0];
          return (selectedRow?.id === params?.data?.id) ?
            {
              component: CellRenderCustomerButtonComponent,
              params: {title: 'white'}
            } :
            {
              component: CellRenderCustomerComponent,
              params: {title: 'black'}
            };
        }
      }
    ];
  }

  private dataCustomer() {
    this.loadingCustomer = true;

    this.customerService.getAllCustomer().subscribe(
      (next: Customer[]) => {
        console.log("customer ->", next);
        this.rowData = next;
        this.rowDataSearch = next;
      },
      error => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
      },
      () => {
        this.loadingCustomer = false;
      }
    )
  }

  private onFilterTextBoxChanged(search: string) {
    console.log("Find menu", search);
    //this.gridApi.setQuickFilter(search)
    //this.gridApi?.setGridOption('quickFilterText', search);
    this.rowDataSearch = this.rowData?.filter(cl =>
      cl.firstName?.toUpperCase().includes(search.trim().toUpperCase()) ||
      cl.email?.toUpperCase().includes(search.trim().toUpperCase()) ||
      cl.phone?.toUpperCase().includes(search.trim().toUpperCase()));
  }
}
