import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ITable, Table} from "@models/table.model";
import {Dropdown, DropdownInterface, DropdownOptions} from "flowbite";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {map} from "rxjs/operators";
import {LocalLayout} from "@models/local.layout.model";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {AuthService} from "@core/services/api/auth.service";
import {LocalLayoutService} from "@core/services/bussiness-logic/local-layout.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-select-table',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './select-table.component.html',
  styleUrl: './select-table.component.css'
})
export class SelectTableComponent implements AfterViewInit, OnInit {

  @ViewChild("dropdownToggleTable", {static: true}) dropdownToggle!: ElementRef;
  @ViewChild("dropdownToggleButtonTable", {static: true}) dropdownToggleButton!: ElementRef;

  dropdown!: DropdownInterface;

  @Output() evHangeSelectedTable = new EventEmitter<ITable | null>();
  selectedTables: Table[] = [];
  table: Table | null = null;

  constructor(private authService: AuthService,
              private tablesService: TablesService,
              private dialogService: DialogService) {
  }

  get getSelectedTable() {
    return !this.table ? "All tables" : this.table.label
  }

  ngOnInit(): void {

    const isUserAdmin = ((this.authService.token.rol === UserrolEnum.ADMIN) ||
      (this.authService.token.rol === UserrolEnum.SUPERVISOR));

    /*
    let readLayout = !isUserAdmin
      ? this.tablesService.getTableByUser(this.authService.token!.user_id)
      : this.tablesService.getTableAllUser();
     */
    let readLayout = this.tablesService.getTableAllUser();

    readLayout
      .subscribe((next: Table[]) => {
        this.selectedTables = next;
      }, (error: any) => {
        console.log(error);
        this.dialogService.openGenericInfo("Error", error)
      });
  }

  ngAfterViewInit(): void {
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

    this.dropdown = new Dropdown(this.dropdownToggle.nativeElement, this.dropdownToggleButton.nativeElement, options);

  }

  onFilterTable(table: Table | null) {
    this.dropdown.hide();
    this.table = table;
    this.evHangeSelectedTable!.emit(table);
  }
}
