import {Component, OnInit} from '@angular/core';
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {ModifiersGroup} from "@models/modifier.model";
import {ColDef, FirstDataRenderedEvent} from "ag-grid-community";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {Aggregate} from "@models/aggregate";
import {FormsModule} from "@angular/forms";
import {
  DropdownElementModifierGroupComponent
} from "@modules/home/component/list-modifiers-group/dropdown-element-modifier-group/dropdown-element-modifier-group.component";
import {
  DropdownModifierGroupComponent
} from "@modules/home/component/list-modifiers-group/dropdown-modifier-group/dropdown-modifier-group.component";
import {
  CardModiferGroupComponent
} from "@modules/home/component/list-modifiers-group/card-modifer-group/card-modifer-group.component";
import {ProgressSpinnerComponent} from "@modules/home/component/progress-spinner/progress-spinner.component";
import {SearchService} from "@core/services/bussiness-logic/search.service";

@Component({
  standalone: true,
  selector: 'app-list-modifiers-group',
  templateUrl: './list-modifiers.component.html',
  imports: [
    FormsModule,
    DropdownElementModifierGroupComponent,
    DropdownModifierGroupComponent,
    CardModiferGroupComponent,
    ProgressSpinnerComponent
  ],
  styleUrl: './list-modifiers.component.css'
})
export class ListModifiersComponent implements OnInit {

  public rowData: ModifiersGroup[] = [];
  public columnDefs: undefined | ColDef[] = [];
  public loading: boolean = false;

  modifierGroup: ModifiersGroup | undefined;
  selectedAggregate: Aggregate | undefined;
  currentPrice: number = 0.0


  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };
  loadingAggretates: boolean = false;

  constructor(
    private modifierService: ModifierService,
    private dialogService: DialogService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.searchService.clearSearch();
    this.onColumnDefs();
    this.onGetData();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  deleteModifierGroup(modifierGroup: ModifiersGroup) {
    this.dialogService
      .openGenericAlert(DialogType.DT_INFORMATION,
        "Question", "You're sure you want to remove the modifier",
        undefined, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
      if (next) {
        this.modifierService.deleteModifierGroup(modifierGroup!.id)
          .subscribe((next: ModifiersGroup[]) => {
            this.rowData = next;
            this.modifierGroup = undefined;
          }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));
      }
    });
  }

  changeModifierGroup($event: ModifiersGroup) {
    //debugger;
    this.modifierService.putModifierGroup($event)
      .subscribe((next: ModifiersGroup[]) => {
        this.rowData = next;
      }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));
  }

  addModifierGroup() {
    this.dialogService.dialogAddModiferGroupComponent()
      .afterClosed().subscribe((next: any) => {
      if (next) {
        this.modifierService.posModifierGroup(next, 0, 0)
          .subscribe((next: ModifiersGroup[]) => {
            this.rowData = next;
          }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error));
      }
    }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error));
  }

  /* Load aggregates for group */
  editingModifierGroup($event: ModifiersGroup) {
    this.loadingAggretates = true;
    this.modifierService.getModifierGroupById($event.id).subscribe((next: ModifiersGroup) => {
      this.modifierGroup = next;
      this.loadingAggretates = false;
    }, error => {
      this.loadingAggretates = false;
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error)
    });
  }

  selAggregate($event: Aggregate) {
    this.selectedAggregate = $event;
  }

  addElementForModifierGroup() {
    if (!this.selectedAggregate) {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, "Selections a product",
        undefined, DialogConfirm.BTN_CLOSE);
      return;
    }

    this.loadingAggretates = true;

    this.modifierService
      .posProductToModifierGroup(this.selectedAggregate!.id, this.modifierGroup!.id, this.currentPrice!)
      .subscribe((next: ModifiersGroup) => {
        this.modifierGroup = next;

        let index = this.rowData.findIndex(p => p.id === this.modifierGroup!.id);
        this.rowData.splice(index, 1, this.modifierGroup);

        this.loadingAggretates = false;
      }, error => {
        this.loadingAggretates = false;
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error)
      });

  }

  deleteElementForModifierGroup(itemElement: Aggregate) {
    ///modifiersGroupsModifier/{modifiersGroupId}/modifier/{modifierId}
    this.dialogService
      .openGenericAlert(DialogType.DT_INFORMATION,
        "Question", "You're sure you want to remove the modifier",
        undefined, DialogConfirm.BTN_CONFIRM)!.afterClosed().subscribe((next: any) => {
      if (next) {
        this.modifierService.deleteElementModifierGroup(this.modifierGroup!.id, itemElement.id)
          .subscribe((next: ModifiersGroup) => {
            this.modifierGroup = next;
            this.onGetData();
          });
      }
    }, error => this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error));
  }

  private onColumnDefs() {
    // filter: 'agTextColumnFilter'
    this.columnDefs = [
      {headerName: 'DESCRIPTION', field: 'description', sortable: true, filter: true}
    ];
  }

  private onGetData() {
    this.loading = true;

    this.modifierService.getModifierGroup()
      .subscribe((next: ModifiersGroup[]) => {
        console.log("modifier group", next);
        this.rowData = this.modifierService.excludeModifierGroupHide(next);
        this.loading = false;
      }, error => {
        this.loading = false;
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, "Error", error)
      });
  }

}
