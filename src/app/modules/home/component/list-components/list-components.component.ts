import {AfterViewInit, Component} from '@angular/core';
import {
  CellClassParams,
  ColDef,
  FirstDataRenderedEvent,
  GridApi,
  GridReadyEvent,
  ValueFormatterParams
} from "ag-grid-community";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {InvPictureRender} from "@modules/home/component/inv-picture-render/inv-picture-render.component";
import {InventoryService} from "@core/services/bussiness-logic/inventory.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogType} from "@core/utils/dialog-type.enum";

import type {DropdownInterface} from 'flowbite';
import {Dropdown} from 'flowbite';
import {
  ButtonsComponentRender
} from "@modules/home/component/list-components/buttons-component-render/buttons-component-render.component";
import {Inventory} from "@models/inventory";
import {Router} from "@angular/router";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {Category} from "@models/category.model";
import {CategoryService} from "@core/services/bussiness-logic/category.service";
import {ModifiersGroup} from "@models/modifier.model";
import {VariableGlobalService} from "@core/services/bussiness-logic/variable-global.service";
import {Measure} from "@models/measure.model";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {MeasureService} from "@core/services/bussiness-logic/measure.service";
import {SharedModule} from "@shared/shared.module";
import {FormsModule} from "@angular/forms";

//import type { InstanceOptions } from 'flowbite';


@Component({
  standalone: true,
  selector: 'app-list-components',
  templateUrl: './list-components.component.html',
  imports: [
    SharedModule,
    FormsModule
  ],
  styleUrl: './list-components.component.css'
})
export class ListComponentsComponent extends AbstractInstanceClass implements AfterViewInit {

  loading: boolean = false;

  public rowData: undefined | Inventory[] = [];
  public columnDefs: undefined | ColDef[] = [];
  gridApi!: GridApi;

  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };

  categories: Category[] = [];
  public measures: Measure[] = [];
  public groupAggregate: ModifiersGroup[] = [];

  constructor(private inventoryService: InventoryService,
              private dialogService: DialogService,
              public searchService: SearchService,
              private categoryService: CategoryService,
              private router: Router,
              public varGlobalService: VariableGlobalService,
              private modifierService: ModifierService,
              private measureService: MeasureService
  ) {
    super();
    //this.searchService.setActivePage(PageSidebarEnum.INVENTORY);
  }

  ngAfterViewInit(): void {
    const $targetEl: HTMLElement = document.getElementById('dropdownDefaultCheckbox')!;
    const $triggerEl: HTMLElement = document.getElementById('dropdownDefaultCheckboxButton')!;

    const dropdown: DropdownInterface = new Dropdown(
      $targetEl,
      $triggerEl
    );
  }

  override ngOnInit(): void {
    this.searchService.clearSearch();
    this.onColumnDefs();
    this.refreshDataInventory();
    this.getCategories();

    this.sub$.push(
      this.searchService.searchObservable().subscribe((search: string) => {
        this.onFilterTextBoxChanged(search)
      }));

    /*
    this.modifierService.getModifierGroup().subscribe((next: ModifiersGroup[] ) => {
      this.groupAggregate = next.sort((a, b) => {
        return (a.description > b.description) ? 1 : -1
      });
    });
    */

    this.measureService.getMeasures().subscribe((next: Measure[]) => {
      console.log("list measure", next);

      this.measures = next.sort((a, b) => {
        return (a.name > b.name) ? 1 : -1
      });
    });
  }

  newProduct() {
    this.router
      .navigateByUrl('/home/layout/inventory/componentEdit/-99');
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

  refreshDataInventory() {
    console.log("inventory ->", this.inventoryService.getInventory());

    this.loading = true;

    this.inventoryService.getInventory().subscribe((nextInventory: Inventory[]) => {
      let filterData = nextInventory;

      if (this.searchService.filterComponentCategories != '-99') {
        filterData = filterData.filter(a => a.categoryComponentId === this.searchService.filterComponentCategories)
      }

      if (this.searchService.filterComponentMeasure != '-99') {
        filterData = filterData.filter(p => p.measureId === this.searchService.filterComponentMeasure)
      }

      /*
      if (this.searchService.filterComponentGModifiers != '-99')
      {
        const modifierGroup = this.groupAggregate
          .filter( a => a.id === this.searchService.filterComponentGModifiers)[0];

        if (modifierGroup)
        {
          const elements = modifierGroup.aggregates.map( a => a.id );

          filterData = filterData.filter( c => elements.includes( c.id) );
        }
      }
      */
      this.rowData = filterData;
      this.loading = false;

    }, error => {
      this.loading = false;
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error);
    });
  }

  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
  }

  onClearFilter() {
    this.searchService.ClearComponentFilter();
    this.refreshDataInventory()
  }

  private onColumnDefs() {
    // filter: 'agTextColumnFilter'
    this.columnDefs = [
      {
        headerName: 'PICTURE', cellRenderer: InvPictureRender, sortable: true, filter: true,
        cellStyle: this.cellStyle, minWidth: 100,
      },
      /*
      {
        headerName: 'PRODUCT ID', field: 'upc', sortable: true, filter: true, cellClass: "font-bold",
        cellStyle: this.cellStyle
      },
      */
      {
        headerName: 'NAME', field: 'name', sortable: true,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'MEASURE', field: 'measure', sortable: false,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'QUANTITY', field: 'unitInStock', valueFormatter: this.AmountFormat, filter: true,
        cellStyle: this.cellStyle
      },
      {
        headerName: 'COST', field: 'unitCost', valueFormatter: this.AmountFormat, filter: true,
        cellStyle: this.cellStyle
      },
      /*
      {
        headerName: 'SALE PRICE', field: 'currentPrice', valueFormatter: this.AmountFormat, filter: true,
        cellStyle: this.cellStyle
      },
      */
      {
        minWidth: 150, cellRenderer: ButtonsComponentRender, cellStyle: this.cellStyle
      }
    ];
  }

  private onFilterTextBoxChanged(search: string) {
    console.log("Find menu", search);
    //this.gridApi.setQuickFilter(search)
    this.gridApi?.setGridOption('quickFilterText', search);
  }

  private getCategories() {
    this.categoryService.getCategories().subscribe((next: Category[]) => {
      console.log("categories ->", next);
      this.categories = next;
    });
  }

}

