import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {Dropdown, DropdownInterface} from "flowbite";
import {Inventory} from "@models/inventory";
import {Category} from "@models/category.model";
import {Measure} from "@models/measure.model";
import {MeasureService} from "@core/services/bussiness-logic/measure.service";
import {CategoryService} from "@core/services/bussiness-logic/category.service";
import 'flowbite-datepicker';
import 'flowbite/dist/datepicker.turbo.js';
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {TimePeriod} from 'ngx-daterangepicker-material/daterangepicker.component';
import {ColDef, FirstDataRenderedEvent, ValueFormatterParams} from "ag-grid-community";
import {getFormatDate} from "@core/utils/functions/transformers";
import {InventorySubmajorService} from "@core/services/bussiness-logic/InventorySubmajor.service";
import {ComponentSubmayor} from "@models/component-submayor.model";
import moment from "moment/moment";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";

@Component({
  selector: 'app-component-edit',
  templateUrl: './component-edit.component.html',
  styleUrl: './component-edit.component.css',

})
export class ComponentEditComponent implements OnInit, AfterViewInit {
  public invoiceEdit: Inventory = {
    //upc: "",
    categoryComponentId: "",
    measureId: "",
    name: "",
    description: "",
    expiryDate: new Date(),
    isRefundable: true,
    unitInStock: 0,
    upc: "",
    minimumStock: 0,
    unitCost: 0,
    amount: 0
  } as Inventory;
  formInventoryEdit: FormGroup | undefined;
  public categories: Category[] | undefined;
  public measures: Measure[] | undefined;
  loading: boolean = false;
  public rowData: undefined | ComponentSubmayor[] = [];
  public columnDefs: undefined | ColDef[] = [
    {headerName: 'DATE', width: 100, field: 'operationDate', valueFormatter: this.DateFormat, sortable: true},
    {headerName: 'OPERATION', width: 150, field: 'inventoryOperationType', sortable: true, filter: true},
    {
      headerName: 'QUANTITY', width: 150, field: 'operationQuantity', sortable: true,
      valueFormatter: this.IntegerFormat,
    },
    {
      headerName: 'COST',
      width: 150,
      field: 'operationCost',
      valueFormatter: this.AmountFormat,
      sortable: true,
      filter: true
    },
    {
      headerName: 'AMOUNT',
      width: 150,
      field: 'operationAmount',
      valueFormatter: this.AmountFormat,
      sortable: true,
      filter: true
    },
    /*{ minWidth: 500, cellRenderer: CellRenderPaid }*/
  ];
  public isNewComponent: boolean = false;
  private componentId!: string;

  constructor(private router: Router,
              private inventoryService: InventoryService,
              private dialogService: DialogService,
              private sanitizer: DomSanitizer,
              private measureService: MeasureService,
              private categoryService: CategoryService,
              private operationService: OperationsService,
              private inventorySubmajorService: InventorySubmajorService,
              private fb: FormBuilder,
              public varGlobalService: VariableGlobalService,
              private activeRouter: ActivatedRoute) {
  }

  ngAfterViewInit(): void {
    // set the dropdown menu element
    const $targetEl: HTMLElement = document.getElementById('dateRangeDropdown')!;
    // set the element that trigger the dropdown menu on click
    const $triggerEl: HTMLElement = document.getElementById('dateRangeButton')!;

    const dropdown: DropdownInterface = new Dropdown(
      $targetEl,
      $triggerEl,
    );

    /*
    const datepickerEl = document.getElementById('datepickerCaducity');
    new Datepicker(datepickerEl, {
      // options
    });
    */

    this.categoryService.getCategories().subscribe((next: Category[]) => {
      console.log("categories ->", next);
      this.categories = next;
    });

    this.measureService.getMeasures().subscribe((next: Measure[]) => {
      console.log("measures ->", next);
      this.measures = next;
    });

  }

  ngOnInit(): void {
    this.getFormReactive();
    this.activeRouter.paramMap.subscribe(params => {
      console.log(params);
      this.componentId = params.get("id")!;
      this.onReadyComponent(this.componentId);
    });
  }

  getFormReactive() {
    this.formInventoryEdit = this.fb.group(
      {
        categoryComponentId: new FormControl("", [Validators.required]),
        measureId: new FormControl("", [Validators.required]),
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", []),
        expiryDate: new FormControl(new Date(), [Validators.required]),
        isRefundable: new FormControl(true, []),
        unitInStock: new FormControl(0, []),
        upc: new FormControl("", [Validators.required]),
        minimumStock: new FormControl(0, []),
        unitCost: new FormControl(0, []),
        amount: new FormControl(0, []),
      }
    );
  }

  IntegerFormat(params: ValueFormatterParams) {
    return Number(params.value).toFixed(2);
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onAllProducts() {
    this.router.navigateByUrl("")
  }

  moveComponent() {
    this.dialogService.dialogEditComponent(this.invoiceEdit!).afterClosed().subscribe((next: Inventory) => {
      if (next) {
        this.invoiceEdit = next;
      }
    })
  }

  onSubmit() {
    this.saveOperation()
  }

  saveOperation() {

    this.invoiceEdit = Object.assign(this.invoiceEdit, this.formInventoryEdit?.value);

    const processData = this.isNewComponent ?
      this.inventoryService.postInventory(this.invoiceEdit) :
      this.inventoryService.putInventory(this.invoiceEdit);

    const textProcess =
      this.isNewComponent ? "Adding Product to Inventory" : "Update product";

    const dialog =
      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Information", textProcess,
        undefined, DialogConfirm.BTN_NONE);

    processData.subscribe((next: any) => {
      dialog.close();
    }, (error: any) => {
      dialog.close();
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error)
    });
  }

  changeDateRange($event: any) {
    if ($event.start && $event.end) {
      console.log("date selector start -> ", $event.start?.toDate()?.toISOString());
      console.log("date selector end -> ", $event.end?.toDate()?.toISOString());

      this.getProductSubmajor($event.start?.toDate()?.toISOString(), $event.end?.toDate()?.toISOString());
    }
  }

  getProductSubmajor(startDate: string, endDate: string) {

    if (this.componentId) {
      this.loading = true;
      this.inventorySubmajorService
        .getProductSubmajor(this.componentId, startDate, endDate).subscribe((next: ComponentSubmayor[]) => {
        console.log(next);
        this.rowData = next;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
      })
    }

  }

  private DateFormat(params: ValueFormatterParams) {
    return moment(params.value).format("MM/DD/YYYY")
  }

  private onReadyComponent(inventoryId: string) {
    if (inventoryId.trim() !== "-99") {
      this.inventoryService.getInventoryId(inventoryId).subscribe((next: Inventory) => {
        this.invoiceEdit = next as Inventory;

        //this.productEdit = next as Product;
        this.formInventoryEdit?.patchValue(next as Inventory);

      }, error => this.dialogService
        .openGenericAlert(DialogType.DT_ERROR, undefined, error, undefined, DialogConfirm.BTN_CLOSE))
    } else {
      this.isNewComponent = true;
    }
  }

}
