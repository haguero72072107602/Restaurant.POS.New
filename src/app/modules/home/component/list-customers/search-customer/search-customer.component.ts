import {Component, Inject, inject} from '@angular/core';
import {CardCustomerComponent} from "@modules/home/component/list-customers/card-customer/card-customer.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  CellClassParams,
  ColDef,
  GridApi,
  GridReadyEvent,
  SelectionChangedEvent
} from "ag-grid-community";
import {Customer} from "@models/customer.model";
import {DialogType} from "@core/utils/dialog-type.enum";
import {CustomerService} from "@core/services/bussiness-logic/customer.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {ProgressCircleComponent} from "@modules/home/component/progress-circle/progress-circle.component";
import {AgGridAngular} from "ag-grid-angular";
import {debounce, map} from "rxjs/operators";
import {debounceTime} from "rxjs";
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";

@Component({
  selector: 'app-search-customer',
  standalone: true,
  imports: [
    CardCustomerComponent,
    ReactiveFormsModule,
    ProgressCircleComponent,
    AgGridAngular,
    NgxTouchKeyboardModule
  ],
  templateUrl: './search-customer.component.html',
  styleUrl: './search-customer.component.css'
})
export class SearchCustomerComponent {

  private formBuilder = inject(FormBuilder);

  formGroup = this.formBuilder.group({
    dataCustomer: this.formBuilder.group({
      firstName: this.formBuilder.control("", Validators.required),
      address: this.formBuilder.group({
        street: this.formBuilder.control("", {nonNullable: true, validators:[Validators.required]})
      }),
      phone: this.formBuilder.control(""),
      email: this.formBuilder.control("", [Validators.required, Validators.email]),
      birthday: this.formBuilder.control(""),
      gender: this.formBuilder.control(0),
      preferredPaymentMethod: this.formBuilder.control(0),
      creditLimit: this.formBuilder.control(0),
      company: this.formBuilder.control(""),
      isActive: this.formBuilder.control(true),
      id: this.formBuilder.control(""),
    })
  });

  public loadingCustomer: boolean = true;
  public rowData: Customer[] = [];
  public rowDataSearch: Customer[] = [];
  public columnDefs: undefined | ColDef[] = [];
  gridApi!: GridApi;
  searchCustomer = new FormControl("");
  selectedRows! : Customer ;

  constructor(
    private dialogRef: MatDialogRef<SearchCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private customerService: CustomerService,
    private dialogService: DialogService,
    public varGlobalService: VariableGlobalService,
  ) {
    this.formGroup.disable();
    this.onColumnDefs();
    this.dataCustomer();

    this.searchCustomer.valueChanges
      .pipe(debounceTime(500))
      .subscribe(res => {
        this.onFilterTextBoxChanged(res!);
    })


  }

  get validateForm()
  {
    return this.selectedRows != null;
  }

  onCancelDialog() {
    this.dialogRef.close()
  }

  onProcessDialog() {
    this.dialogRef.close(this.selectedRows)
  }

  cellStyle(params: CellClassParams<any, any>) {
    return {
      /*color: (params.data.unitInStock < 0) ? '#EA5252' : 'black',*/
      display: "flex",
      alignItems: "center",
      justifyContent: "left"
    };
  }

  private onColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'CUSTOMER NAME', field: 'name', sortable: true,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'EMAIL ADDRESS', field: 'email', filter: true,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'PHONE NUMBER', field: 'phone', sortable: false,
        cellStyle: this.cellStyle
      }
    ];
  }

  private dataCustomer() {
    this.loadingCustomer = true;

    this.customerService.getAllCustomer()
      .pipe(map((next:Customer[]) => {
        next.forEach( p => {
          p.email = p.email != null ? p.email : "";
          p.name = p.name != null ? p.name : "";
        })
        return next;
      }))
      .subscribe(
      (next: Customer[]) => {
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

  onGridReady($event: GridReadyEvent<Customer>) {
    this.gridApi = $event.api;
  }

  onSelectionChanged($event: SelectionChangedEvent<Customer>) {
    this.selectedRows = $event.api.getSelectedRows()[0];

    if (this.selectedRows){
      this.formGroup!.patchValue({dataCustomer: this.selectedRows });
    }

  }

  private onFilterTextBoxChanged(search: string) {
    console.log("Find menu", search);
    //this.gridApi.setQuickFilter(search)
    this.gridApi?.setGridOption('quickFilterText', search.trim().toUpperCase());
  }


}
