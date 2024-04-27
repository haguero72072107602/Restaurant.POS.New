import {DataStorageService} from "@core/services/api/data-storage.service";
import {Table} from "@models/table.model";
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {BehaviorSubject, Observable} from "rxjs";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {LocalLayout} from "@models/local.layout.model";
import {Injectable} from "@angular/core";
import {StatusTable} from "@core/utils/operations";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {catchError} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";

@Injectable({
  providedIn: 'root'
})
export class TablesService {


  private tableObservable: BehaviorSubject<Table[]> = new BehaviorSubject<Table[]>([]);
  private selectedTables: Table[] = [];

  private layout: LocalLayout | undefined;

  constructor(
    private dataStore: DataStorageService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) {
  }

  get getTableObservable(): Observable<Table[]> {
    return this.tableObservable.asObservable();
  }

  get getTableSelected(): Table[] {
    return this.selectedTables;
  }

  get layoutActive() {
    return this.layout;
  }

  setTableSelected(table: Table) {
    if (![UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR].includes(this.authService.token!.rol!)) {
      this.clearTableSelected();
      this.selectedTables.push(table);
      this.pushTablesUpdate(this.selectedTables);
    } else {
      if (table.selected) {
        const found = this.selectedTables.filter(p => p.id === table?.id);
        if (found.length === 0) {
          this.selectedTables.push(table);
        }
      } else {
        this.selectedTables = this.selectedTables.filter(t => t.id != table?.id)
      }
    }
    console.log("select tables -> ", this.selectedTables);
  }

  clearTableSelected() {
    this.selectedTables = [];
  }

  pushTablesUpdate(tables: Table[]) {
    this.tableObservable.next(tables);
  }

  setTable(table: Table): Observable<Table> {
    return this.dataStore.setTable(table);
  }

  setUpdateTable(table: Table): Observable<any> {
    return this.dataStore.updateTable(table);
  }

  setTableAll(table: Table[]): Observable<Table[]> {
    return this.dataStore.updateTableAll(table);
  }

  setTableStatus(status?: StatusTable) {
    return true;
    if (this.selectedTables.length === 1) {
      this.selectedTables[0]!.status = status!;
      this.setTableAll([this.selectedTables[0]!])
        .subscribe((next: any) => {
          return true;
        }, error => {
          this.dialogService.openGenericInfo("Error", error);
        });
    }
    return false;
  }

  getTablesLocationUser(layout: string, userId: string): Observable<Table[]> {
    return this.dataStore.getTablesLocationUser(layout, userId)
  }

  getTablesLocation(layout: string): Observable<Table[]> {
    return this.dataStore.getTablesLocation(layout)
  }

  /* Layout */

  getTable(id: string): Observable<Table> {
    return this.dataStore.getTable(id)
  }

  setLayout(layout: LocalLayout | undefined) {
    this.layout = layout;
  }

  getTextStatus(status: StatusTable) {
    switch (status) {
      case StatusTable.DISABLE :
        return "Disable"
      case StatusTable.AVAILABLE :
        return "Avaible"
      case StatusTable.BUSY :
        return "Busy"
      case StatusTable.RESERVED :
        return "Reserved"
      case StatusTable.BILLED :
        return "Billed"
      case StatusTable.COMING :
        return "Coming"
    }
  }

  getTableByUser(idUser: string): Observable<Table[]> {
    return this.dataStore.getTableByUser(idUser);
  }

  getTableAllUser(): Observable<Table[]> {
    return this.dataStore.getTableAllUser();
  }

  updateStateTable(): Observable<any> {
    return this.dataStore.updateStateTable();
  }

}
