import {Component, ElementRef, Inject, OnInit, ViewChild,} from '@angular/core';
import {UsersService} from '@core/services/bussiness-logic/users.service';
import {AuthService} from '@core/services/api/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CashService} from '@core/services/bussiness-logic/cash.service';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {User} from '@models/user.model';
import {map} from 'rxjs';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit, ICellRendererAngularComp {
  params!: ICellRendererParams;
  @ViewChild('description', {static: true}) textMotion:
    | undefined
    | ElementRef;
  public team_role: string = '';
  available: boolean = false;
  pin: string = '';
  repeat_pin: string = '';
  keycard: boolean = false;
  new_pin: string = '';

  constructor(
    public usersService: UsersService,
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<UpdateUserComponent>,
    private cashService: CashService,
    public dataStore: DataStorageService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {

  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {

    this.params = this.data.params;
  }

  onSaveUser(): void {

    if (this.new_pin != "") {
      if (this.pin == this.new_pin) {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'The pin and repeat pin must be' +
          ' differents', null, DialogConfirm.BTN_CLOSE);
      } else if (this.new_pin != this.repeat_pin) {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'The pin and repeat pin must be' +
          ' differents', null, DialogConfirm.BTN_CLOSE);
      }

    } else {
      const user = this.data.user as User;
      const response: any = this.usersService.updateUser(user).subscribe(next => {
        this.dialogRef.close();
        this.dialogService.openGenericAlert(DialogType.DT_SUCCESS, 'Success !', 'User edited correctly', null, DialogConfirm.BTN_CLOSE);
        this.charge();
      }, error1 => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error !', 'Can\'t edit the employe', null, DialogConfirm.BTN_CLOSE);
      });
    }
  }

  onChangeSelectRole($event: any) {
    this.team_role = $event.target.value;
  }

  changeAvailable() {
    this.available = !this.available
  }

  onClose() {
    this.dialogRef.close();
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
      this.dialogService
        .openGenericAlert(DialogType.DT_ERROR, undefined, error, undefined, DialogConfirm.BTN_CLOSE)
    })
  }
}
