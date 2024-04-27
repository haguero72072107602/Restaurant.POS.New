import {Component, OnInit} from '@angular/core';
import {
  CellClassParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams
} from "ag-grid-community";
import {ButtonsMenuRender} from "@modules/home/component/list-menu/buttons-menu-render/buttons-menu-render.component";
import {InvPictureRender} from "@modules/home/component/inv-picture-render/inv-picture-render.component";
import {DepartProductService} from "@core/services/bussiness-logic/depart-product.service";
import {Product} from "@models/product.model";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {Router, RouterModule} from "@angular/router";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {StockService} from "@core/services/bussiness-logic/stock.service";
import {Department} from "@models/department.model";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {Measure} from "@models/measure.model";
import {MeasureService} from "@core/services/bussiness-logic/measure.service";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {ModifiersGroup} from "@models/modifier.model";
import {DialogType} from "@core/utils/dialog-type.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "@shared/shared.module";
import {AgGridModule} from "ag-grid-angular";

@Component({
  standalone: true,
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  imports: [
    FormsModule,
    AgGridModule,
    RouterModule
  ],
  styleUrls: ['./list-menu.component.css']
})
export class ListMenuComponent extends AbstractInstanceClass implements OnInit {

  loading: boolean = false;
  gridApi!: GridApi;
  filterMenu: any = "-99";

  public rowData: undefined | Product[] = [];
  public columnDefs: undefined | ColDef[] = [];
  selectionRow: "single" | "multiple" | undefined = "single";

  public departments: Department[] = [];
  public measures: Measure[] = [];
  public groupAggregate: ModifiersGroup[] = [];

  defaultColDef: ColDef = this.varGlobalService.defaultColDef;


  constructor(private departProductService: DepartProductService,
              private router: Router,
              private stockService: StockService,
              public searchService: SearchService,
              private measureService: MeasureService,
              private modifierService: ModifierService,
              private dialogService: DialogService,
              private varGlobalService: VariableGlobalService
  ) {
    super();
    //this.searchService.setActivePage(PageSidebarEnum.INVENTORY);

    this.sub$.push(
      this.searchService.searchObservable().subscribe((search: string) => {
        this.onFilterTextBoxChanged(search)
      }));
  }

  override ngOnInit(): void {
    this.searchService.clearSearch();
    this.departments = this.departProductService.getDepartament().sort((a, b) => {
      return (a.name > b.name) ? 1 : -1
    });

    this.measureService.getMeasures().subscribe((next: Measure[]) => {
      console.log("list measure", next);

      this.measures = next.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1
      });
    }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));

    this.modifierService.getModifierGroup().subscribe((next: ModifiersGroup[]) => {
      this.groupAggregate = next.sort((a, b) => {
        return (a.description > b.description) ? 1 : -1
      });
    }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));

    this.onColumnDefs();
    this.refreshDataProduct();
  }

  newProduct() {
    this.router.navigateByUrl("/home/layout/inventory/productEdit/-99")
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  cellStyle(params: CellClassParams<any, any>) {
    return {
      color: (params.data.unitInStock < 0) ? '#EA5252' : 'black',
      display: "flex",
      alignItems: "center",
    };
  }

  AmountFormat(params: ValueFormatterParams) {
    return '$ ' + Number(params.value).toFixed(2);
  }

  refreshDataProduct() {
    this.loading = true;

    this.stockService.getProductsList().subscribe((next: Product[]) => {

      console.log("read products -> ", next);

      let filterdata: Product[] = next;

      console.log("Data filter -> ", filterdata);

      if (this.searchService.filterDepartment != '-99') {
        filterdata = filterdata.filter(p => p.departmentId === this.searchService.filterDepartment)
      }

      if (this.searchService.filterMeasure != '-99') {
        filterdata = filterdata.filter(p => p.measureId === this.searchService.filterMeasure)
      }

      if (this.searchService.filterAggregate != '-99') {
        filterdata = filterdata
          .filter(p =>
            p.groupDetails!.filter(e => e.id === this.searchService.filterAggregate).length > 0)
      }
      this.rowData = filterdata;
      this.loading = false;

    }, error => {
      this.loading = false;
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
    })
  }

  onFilterTextBoxChanged(search: string) {
    this.gridApi?.setGridOption('quickFilterText', search);
  }

  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
  }

  setFilterCriteria() {
    this.refreshDataProduct();
  }

  onClearFilter() {
    this.searchService.ClearFilterMenu();
    this.setFilterCriteria();
  }

  private onColumnDefs() {

    // filter: 'agTextColumnFilter'
    this.columnDefs = [
      {
        minWidth: 50, headerName: 'PICTURE', cellRenderer: InvPictureRender, sortable: true, filter: true,
      },
      {
        minWidth: 80, headerName: 'PRODUCT ID', field: 'upc', sortable: true, filter: true, cellClass: "font-bold",
        cellStyle: this.cellStyle
      },
      {
        minWidth: 150, headerName: 'NAME', field: 'name', sortable: true, cellStyle: this.cellStyle,
      },
      /*
      {
        minWidth: 300,headerName: 'DESCRIPTION', field: 'description', cellStyle: this.cellStyle, wrapText: true
      },
      */
      {
        minWidth: 80, headerName: 'QUANTITY', field: 'unitInStock', filter: true, cellClass: "font-bold",
        cellStyle: this.cellStyle
      },
      {
        minWidth: 80
        ,
        headerName: 'SALE PRICE',
        field: 'unitCost',
        valueFormatter: this.AmountFormat,
        filter: true,
        cellClass: "font-bold",
        cellStyle: this.cellStyle
      },
      {minWidth: 150, cellRenderer: ButtonsMenuRender}
    ];
  }
}
