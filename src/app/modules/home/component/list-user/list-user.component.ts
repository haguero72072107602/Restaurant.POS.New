import {AfterViewInit, Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

import {UserPosition} from "@core/utils/user-position.enum";
import type {DropdownInterface, DropdownOptions} from "flowbite";
import {Dropdown, initFlowbite} from 'flowbite'
import {dateFormatter, removeTFromISODate} from '@core/utils/functions/transformers';
import {CheckboxCellEditor, ColDef, FirstDataRenderedEvent, GridApi, GridReadyEvent} from "ag-grid-community";
import {AuthService} from "@core/services/api/auth.service";
import {UsersService} from '@core/services/bussiness-logic/users.service';
import {PositionType} from '@models/position-type';
import {User} from '@models/user.model';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {ButtonsTable} from '@modules/home/component/list-user/buttons-table/buttons-table';
import {TableCellRender} from '../table-cell-render/table-cell-render';
import {MatDialog} from "@angular/material/dialog";
import {HaveKeycardComponent} from '../have-keycard/have-keycard.component';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {CreateUserComponent} from "@modules/home/component/list-user/create-user/create-user/create-user.component";

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent extends AbstractInstanceClass implements OnInit, AfterViewInit {
  loading: boolean = true;

  public rowData: undefined | User[] = [];
  public userSelected: undefined | User;
  public columnDefs: undefined | ColDef[] = [];
  images: any[] = [];
  deleteDisable: boolean = false;
  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true
  };
  selected: any;
  $targetEl?: HTMLElement;
  $triggerEl?: HTMLElement;
  selectMovement: number = 0;
  protected readonly UserPosition = UserPosition;
  private gridApi!: GridApi<User>;
  private params: any;
  private userPosition: undefined | UserPosition = UserPosition.ALL;

  constructor(public usersService: UsersService,
              public dataStore: DataStorageService,
              private authService: AuthService,
              private dialogService: DialogService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    super();
    initFlowbite();
  }

  ngAfterViewInit(): void {
    //this.pickerDirective!.minDate = dayjs();
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
      this.userPosition = param['id']
    });

    this.onColumnDefs();

    this.usersService.selectionModel.clear();

    this.charge();
  }

  onGridReady(params: GridReadyEvent<User>) {
    this.gridApi = params.api;
    this.params = params;
    this.charge();

  }

  charge() {
    this.dataStore.getApplicationUsers().pipe(map((user: User[]) => {
      user.forEach((item, index) => {
        item.orderInfo = item.userName?.charAt(0);
      })
      return user;
    })).subscribe((next: User[]) => {
      next.forEach(element => {
        if (this.authService?.token!.user_id == element.id) {
          next.splice(next.indexOf(element), 1);
        }
      });
      console.log("User: ", next);
      this.rowData = next;
      this.loading = false;
    }, error => {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error, undefined, DialogConfirm.BTN_CLOSE)
    })
  }

  selectedAll($event: Event) {
    console.log("input", $event)
    console.log(this.selectMovement);
    (this.selectMovement) ?
      this.usersService.selectionModel.select(...this.usersService.items) :
      this.usersService.selectionModel.clear();
  }

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    console.log("User selected:", selectedRows[0]);
    this.userSelected = selectedRows[0];

  }

  convertToDateString(date: any) {
    return removeTFromISODate(dateFormatter(date));
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  changeSelected(item: PositionType) {
    this.usersService?.selectionModel!.toggle(item);
  }

  onNewUser() {
    console.log("Touch new");
    this.dialog.open(CreateUserComponent, {
      width: '620px', height: '600px', data: {
        params: this.params
      },
      disableClose: true
    }).afterClosed().subscribe(next => {
      if (next) {
        console.log(next);
        /*
        this.invoiceService.createInvoice(ETXType.DINEIN, next!.table!.id, i => {
          this.invoiceService.setDineIn(next!.table!).subscribe((order: Order) => {
            this.invoiceService.txType = ETXType.DINEIN;
            this.invoiceService.order = order;
            this.tableService.setTableSelected(next!.table!);
            this.tableService.setTableStatus(StatusTableEnum.BUSY);
            this.searchService.setActivated(0);
            this.invoiceService.setOrderEmit(order);
            this.router.navigateByUrl("/home/layout/invoice/departaments");
          }, error => {
            this.cashService.openGenericInfo("Error", error)
          });
        });
        */
      }
    });
  }

  private onColumnDefs() {

    this.columnDefs = [
      {headerName: '', maxWidth: 120, cellRenderer: CheckboxCellEditor},
      {headerName: 'AVATAR', maxWidth: 130, cellRenderer: TableCellRender},
      {headerName: 'USER', maxWidth: 150, field: 'userName'},
      {headerName: 'NAME', maxWidth: 170, field: 'fullName'},
      {headerName: 'POSITION', minWidth: 120, field: 'userPosition'},
      {headerName: 'KEYCARD', maxWidth: 130, cellRenderer: HaveKeycardComponent},
      {minWidth: 240, maxWidth: 270, cellRenderer: ButtonsTable}
    ];
  }
}

