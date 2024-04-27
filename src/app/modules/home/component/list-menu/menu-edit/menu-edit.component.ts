import {AfterViewInit, Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {Product} from "@models/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Inventory} from "@models/inventory";
import {Measure} from "@models/measure.model";
import {MeasureService} from "@core/services/bussiness-logic/measure.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {ProductComponent} from "@models/product-component.model";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";
import {StockService} from "@core/services/bussiness-logic/stock.service";
import {Department} from "@models/department.model";
import {Dropdown} from "flowbite";
import {ModifiersGroup} from "@models/modifier.model";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {
  ListProductModifierGroupComponent
} from "@modules/home/component/list-product-modifier-group/list-product-modifier-group.component";
import {
  DropdownModifierComponent
} from "@modules/home/component/list-modifiers-group/dropdown-modifier/dropdown-modifier.component";
import {ProductService} from "@core/services/bussiness-logic/product.service";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent, ValueFormatterParams} from "ag-grid-community";
import moment from "moment";
import {InventorySubmajorService} from "@core/services/bussiness-logic/InventorySubmajor.service";
import {ProductSubmajor} from "@models/product.submajor";
import {HomeModule} from "@modules/home/home.module";
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {NgClass} from "@angular/common";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {AgGridModule} from "ag-grid-angular";
import {
  ListProductComponentComponent
} from "@modules/home/component/list-product-component/list-product-component.component";
import {DropdownComponentComponent} from "@modules/home/component/dropdown-component/dropdown-component.component";
import {Aggregate} from "@models/aggregate";
import {DateRangeComponent} from "@modules/home/component/daterange/daterange.component";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import dayjs from "dayjs/esm";
import {dateRangeISO, removeTFromISODate} from "@core/utils/functions/transformers";
import {ButtonDateRangeComponent} from "@modules/home/component/button-date-range/button-date-range.component";
import {DateRange} from "@angular/material/datepicker";

@Component({
  standalone: true,
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  imports: [
    NgxTouchKeyboardModule,
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    NgxDaterangepickerMd,
    AgGridModule,
    ListProductModifierGroupComponent,
    DropdownModifierComponent,
    ListProductComponentComponent,
    DropdownComponentComponent,
    DateRangeComponent,
    ButtonDateRangeComponent
  ],
  styleUrl: './menu-edit.component.css'
})
export class MenuEditComponent implements OnInit, AfterViewInit {
  @ViewChild('appListProduct') appListProduct?: ListProductModifierGroupComponent;
  @ViewChild('cmpModifierGroup') cmpModifierGroup?: DropdownModifierComponent

  public dropdown?: Dropdown;
  public optionSelected: number = 0;

  public measures: Measure[] = [];
  public productComponent: ProductComponent[] = [];
  public productModifiersGroup: any[] = [];
  public departments: Department[] = [];
  public selMeasures: Measure[] = [];
  public isNewProduct: boolean = false;

  selComponentId: string = "";
  selMeasureId: string = "";
  selQuantity: number = 0;
  menuForm: FormGroup | undefined;
  imageMenu: any;
  productEdit: Product | undefined = {} as Product;
  loading: boolean = false;
  public rowData: undefined | ProductSubmajor[] = [];
  public columnDefs: undefined | ColDef[] = [
    {headerName: 'DATE', width: 100, field: 'operationDate', valueFormatter: this.DateFormat, sortable: true},
    {headerName: 'OPERATION', width: 150, field: 'inventoryOperationType', sortable: true, filter: true},
    {headerName: 'QUANTITY', width: 150, field: 'operationQuantity', sortable: true},
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
  dateSubmayor!: DateRange<Date>;
  protected readonly RangeDateOperation = RangeDateOperation;
  private selModifiersGroup: ModifiersGroup | undefined;
  private gridApi!: GridApi;

  constructor(private router: Router,
              private invoiceService: InvoiceService,
              private inventoryService: InventoryService,
              private stockService: StockService,
              private measureService: MeasureService,
              private modifierService: ModifierService,
              private productService: ProductService,
              private departProductService: DepartProductService,
              private sanitizer: DomSanitizer,
              private dialogService: DialogService,
              private formBuilder: FormBuilder,
              public varGlobalService: VariableGlobalService,
              private inventorySubmajor: InventorySubmajorService,
              private activeRouter: ActivatedRoute) {
    this.initFormData();
  }

  ngAfterViewInit(): void {
    const $targetEl = document.getElementById('dropdownSearchDepart');
    const $triggerEl = document.getElementById('dropdownSearchDepartButton');

    this.dropdown = new Dropdown($targetEl, $triggerEl);

    this.getDepartments();
    this.getMeasure();
  }

  ngOnInit(): void {
    this.activeRouter.paramMap.subscribe(params => {
      console.log(params);
      this.onReadyProduct(params.get("id")!);
    });
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
  }

  getMeasure() {
    this.measureService.getMeasures().subscribe((next: Measure[]) => {
      this.selMeasures = next;
    });
  }

  getDepartments() {
    this.departments = this.departProductService.getDepartament();
  }

  getModifierGroupByProduct(idProduct: string) {
    this.modifierService.getModifierGroupByProduct(idProduct).subscribe((next: ModifiersGroup[]) => {
      console.log('Modifier group by product ', next);
      this.productModifiersGroup = this.modifierService.excludeModifierGroupHide(next);
    }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));
  }

  getProductComponents(idProduct: string) {
    this.inventoryService.getProductComponents(idProduct)
      .subscribe((next: ProductComponent[]) => {
        console.log("List product component ->", next)
        this.productComponent = next;
      }, error => this.dialogService
        .openGenericAlert(DialogType.DT_ERROR, undefined, error, undefined, DialogConfirm.BTN_CLOSE));
  }

  onReadyProduct(productId: string) {

    if (productId != "-99") {
      this.invoiceService.getProduct(productId).subscribe((next: any) => {

        this.productEdit = next as Product;
        this.menuForm?.patchValue(next as Product);

        this.imageMenu = next.image != undefined ?
          this.sanitizer.sanitize(SecurityContext.NONE,
            this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + next.image))
          : undefined

        this.getProductComponents(this.productEdit?.id!);
        this.getModifierGroupByProduct(this.productEdit?.id!);

      });
    } else {
      //new Intl.DateTimeFormat('en-US').format(date)

      this.isNewProduct = true
    }
  }

  onSubmit() {
    this.productEdit = Object.assign(this.productEdit!, this.menuForm?.value)

    const processData = this.isNewProduct ?
      this.productService.postProduct(this.productEdit!) : this.productService.putProduct(this.productEdit!);

    const textProcess = this.isNewProduct ? "New peoduct" : "Update product";

    const dialog =
      this.dialogService.openGenericAlert(DialogType.DT_INFORMATION, "Information", textProcess,
        undefined, DialogConfirm.BTN_NONE);

    processData.subscribe((next: any) => {
      dialog!.close();
      this.productEdit = Object.assign(this.productEdit!, next)

      this.departProductService.loadData();

      this.onReadyProduct(this.productEdit?.id!);
    }, (error: any) => {
      dialog!.close();
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error)
    });
  }

  onAllProducts() {
    this.router.navigateByUrl("/home/layout/inventory/inventorylist")
  }

  evSelectedInvoice($event: Inventory) {
    console.log("Selected invoive => ", $event)

    this.selComponentId = $event.id;

    this.measureService.getAssociatedMeasures($event.measureId).subscribe((next: Measure[]) => {
      console.log("seelect convert measure =>", next);
      this.measures = next;
      if (next.length > 0) {
        this.selMeasureId = next[0].id
      }
    });

  }

  AddComponent() {
    if (this.selComponentId.trim() === "") {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, "Select a component",
        undefined, DialogConfirm.BTN_CLOSE);
      return;
    }

    if (this.selMeasureId.trim() === "") {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, "Select a unit of measure",
        undefined, DialogConfirm.BTN_CLOSE);
      return;
    }

    if (this.selQuantity <= 0) {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, "The amount must be greater than zero",
        undefined, DialogConfirm.BTN_CLOSE);
      return;
    }

    let productComponent: ProductComponent = {
      componentId: this.selComponentId.trim(),
      productId: this.productEdit?.id!,
      measureId: this.selMeasureId.trim(),
      amountToConvert: this.selQuantity,
      componentName: "",
      measure: "",
      componentUpc: ""
    }

    this.inventoryService.addProductComponents(productComponent).subscribe((next: ProductComponent[]) => {
      console.log(next);
      this.productComponent = next;
    });

  }

  deleteProductComponent($event: ProductComponent) {
    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION,
      'Question', "You are sure you want to remove this component", undefined, DialogConfirm.BTN_CONFIRM)!
      .afterClosed().subscribe(next => {
      if (next) {
        console.log("Eliminae elemento");
        this.inventoryService.delProductComponents($event.productId, $event.componentId)
          .subscribe((next: ProductComponent[]) => {

            this.productComponent = next;

          }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error))
      }
    })
  }

  selectOptionButton(value: number) {
    this.optionSelected = value
  }

  selectModifierGroup($event: ModifiersGroup) {
    this.selModifiersGroup = $event
  }

  addModifierGroup() {
    if (!this.selModifiersGroup) {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, "Select a modifier group",
        undefined, DialogConfirm.BTN_CLOSE);
      return;
    }

    this.modifierService.posMenuToGroupProduct(this.productEdit?.id!, this.selModifiersGroup.id, 0)
      .subscribe((next: ModifiersGroup[]) => {

        console.log("Add modifiers group ", next)
        this.getModifierGroupByProduct(this.productEdit?.id!);

      }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));

    this.selModifiersGroup = undefined;
    this.cmpModifierGroup?.clearSelected()
  }

  deleteModifierByMenu($event: ModifiersGroup) {
    this.dialogService.openGenericAlert(DialogType.DT_INFORMATION,
      "Question", "You are sure you want to remove this modifier group", undefined, DialogConfirm.BTN_CONFIRM)!
      .afterClosed().subscribe(next => {
      if (next) {
        console.log("Eliminae elemento");
        this.modifierService.deleteModifierGroupByMenu(this.productEdit?.id!, $event.id)
          .subscribe((next: ModifiersGroup[]) => {

            this.getModifierGroupByProduct(this.productEdit?.id!);

          }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error))
      }
    })
  }

  adjustProduct() {
    this.dialogService.dialogEditComponent(this.productEdit!).afterClosed().subscribe((next: Inventory) => {
      if (next) {
        //this.invoiceEdit = next;
      }
    })
  }

  showDetailMenu($event: DateRange<Date>) {
    this.dateSubmayor = $event;

    if (this.dateSubmayor.end && this.dateSubmayor.start) {
      this.loading = true;
      this.inventorySubmajor
        .getMenuSubmajor(
          this.productEdit?.id!,
          moment(this.dateSubmayor.start).format("MM-DD-yyyy HH:mm"),
          moment(this.dateSubmayor.end).format("MM-DD-yyyy HH:mm"))
        .subscribe((next: ProductSubmajor[]) => {
          this.rowData = next;
          console.log(next);
          this.loading = false;
        }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));
    }
  }

  onFileSelected($event: any) {
    const file: File = $event.target.files[0];

    if (file) {
      const formData: FormData = new FormData();
      formData.append('image', file);
      console.log("Load file ->", formData);
    }
  }

  private initFormData() {
    this.menuForm = this.formBuilder.group(
      {
        measureId: new FormControl("", [Validators.required]),
        upc: new FormControl("", [Validators.required, Validators.min(0)]),
        name: new FormControl("", [Validators.required]),
        description: new FormControl("", []),
        departmentId: new FormControl("", [Validators.required]),
        currentPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
        unitCost: new FormControl(0, [Validators.required, Validators.min(0)]),
        tax: new FormControl(0, [Validators.required, Validators.min(0)]),
        isStar: new FormControl(false, []),
        starPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
        firstFree: new FormControl(false, []),
        visible: new FormControl(false, []),
      }
    );
  }

  private DateFormat(params: ValueFormatterParams) {
    return moment(params.value).format("MM/DD/YYYY")
  }
}
