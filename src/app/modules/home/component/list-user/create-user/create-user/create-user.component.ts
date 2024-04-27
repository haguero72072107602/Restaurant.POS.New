import {Component, ElementRef, Inject, OnInit, ViewChild,} from '@angular/core';
import {UsersService} from '@core/services/bussiness-logic/users.service';
import {AuthService} from '@core/services/api/auth.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {User} from '@models/user.model';
import {map} from 'rxjs';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {DialogConfirm, DialogType} from "@core/utils/dialog-type.enum";
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";
import {FormsModule} from "@angular/forms";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";

@Component({
  standalone: true,
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  imports: [
    NgxTouchKeyboardModule,
    FormsModule
  ]
})
export class CreateUserComponent implements OnInit, ICellRendererAngularComp {
  params!: ICellRendererParams;
  @ViewChild('description', {static: true}) textMotion:
    | undefined
    | ElementRef;

  public username: string = '';
  name: string = '';
  pin: string = '';
  repeat_pin: string = '';
  keycard: string = '';
  team_role: string = '5';
  available: boolean = false;

  constructor(
    public usersService: UsersService,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    private dialogService: DialogService,
    public dataStore: DataStorageService,
    public configurationService: ConfigurationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  agInit(params: ICellRendererParams<any, any, any>): void {

  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true;
  }

  ngOnInit(): void {
    this.params = this.data.params;

  }

  onSaveUser(): void {

    const username = this.username;
    const name = this.name;
    const password = this.pin;
    const repeat_pin = this.repeat_pin;
    const keycard = this.keycard;
    const userPositionId = this.team_role;

    const companyId = this.configurationService.sysConfig.companyId;

    if (username == "" || name == "") {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'Can\'t add the employe, some required info' +
        ' is empty', null, DialogConfirm.BTN_CLOSE);
    } else if (password != repeat_pin) {
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error', 'The pin and repeat pin must be equals', null, DialogConfirm.BTN_CLOSE);
    } else {
      const user = {
        username,
        password,
        passwordByCard: password,
        firstName: name,
        fullName: name,
        userPositionId,
        companyId: companyId
      }

      const response: any = this.usersService.createUser(user).subscribe(next => {
        this.dialogRef.close();
        this.dialogService.openGenericAlert(DialogType.DT_SUCCESS, 'Success !', 'User created correctly', null, DialogConfirm.BTN_CLOSE);
        this.charge();
      }, error1 => {
        this.dialogService.openGenericAlert(DialogType.DT_ERROR, 'Error !', 'Can\'t edit the employe', null, DialogConfirm.BTN_CLOSE);
      });

    }


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
      this.dialogService.openGenericAlert(DialogType.DT_ERROR, undefined, error, undefined, DialogConfirm.BTN_CLOSE)
    })
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
}
