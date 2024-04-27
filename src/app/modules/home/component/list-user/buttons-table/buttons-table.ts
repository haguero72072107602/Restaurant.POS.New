import {Component} from '@angular/core';
import {ICellRendererParams} from "ag-grid-community";
import {ICellRendererAngularComp} from "ag-grid-angular";
import {User} from '@models/user.model';
import {MatDialog} from '@angular/material/dialog';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {UsersService} from '@core/services/bussiness-logic/users.service';
import {UpdateUserComponent} from '@modules/home/component/list-user/update-user/update-user.component';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {AuthService} from "@core/services/api/auth.service";
import {map} from "rxjs/operators";
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";


@Component({
  selector: 'app-buttons-table',
  templateUrl: './buttons-table.html',
  styleUrls: ['./buttons-table.css']
})
export class ButtonsTable implements ICellRendererAngularComp {
  params!: ICellRendererParams;
  user: null | User = null;

  constructor(
    private dialog: MatDialog,
    public usersService: UsersService,
    private dialogService: DialogService,
    public dataStore: DataStorageService,
    private authService: AuthService,
  ) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {
    this.params = params;
    this.user = this.params!.data! as User;
    console.log('Table cell', this.user);
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    this.params = params;
    return true;
  }

  deleteUser() {
    this.dialogService
      .openGenericAlert(DialogType.DT_INFORMATION,
        "Confirm", 'You\'re sure you want to delete this user', undefined, DialogConfirm.BTN_CONFIRM)!
      .afterClosed().subscribe((next: any) => {
      console.log(next);
      if (next !== undefined && next.confirm) {
        this.usersService.deleteUser(this.user!.id).subscribe(next => {
          this.dialogService.openGenericAlert(DialogType.DT_SUCCESS, undefined, 'User deleted correctly', null, DialogConfirm.BTN_CLOSE);
          this.charge();
        }, error1 => {
          this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, 'Can\'t edit the employe', null, DialogConfirm.BTN_CLOSE);
        });
      }
    });
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
      this.params.api.setRowData(next);

    }, error => {
      this.dialogService.openGenericInfo("Error", error)
    })
  }

  editUser() {
    console.log("Seleted user is:", this.user!.userName);

    this.dialog.open(UpdateUserComponent, {
      width: '630px', height: '640px', data: {
        user: this.user,
        params: this.params
      },
      disableClose: true
    }).afterClosed().subscribe(next => {
      if (next) {
        console.log(next);
      }
    });
  }
}
