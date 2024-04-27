import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AssignTableComponent} from "@modules/home/component/assign-table/assign-table.component";
import {AddTableComponent} from "@modules/home/component/add-table/add-table.component";
import {MatDialog} from "@angular/material/dialog";
import {Table} from "@models/table.model";
import {LocalLayout} from "@models/local.layout.model";
import {TablesService} from "@core/services/bussiness-logic/tables.service";

@Component({
  selector: 'app-add-card-table',
  templateUrl: './add-card-table.component.html',
  styleUrls: ['./add-card-table.component.css']
})
export class AddCardTableComponent {
  @Input() localLayout?: LocalLayout;
  @Output() eventTable: EventEmitter<Table> = new EventEmitter<Table>();

  constructor(
    private dialog: MatDialog,
    private tableService: TablesService) {
  }

  onAddTable() {
    if (this.tableService.layoutActive?.usedTableNumber! <= this.tableService.layoutActive?.totalTableNumber!) {
      this.dialog.open(AddTableComponent, {
        width: '379px', height: '360px', data: {},
        disableClose: true
      }).afterClosed().subscribe(next => {
        console.log(next);
        if (next) {
          this.eventTable.emit(next);
        }
      });
    }
  }
}
