import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Token} from "../../../models";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {AuthService} from "@core/services/api/auth.service";

@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent implements OnInit, OnDestroy {
  rol: UserrolEnum[];
  cashierToken?: Token;

  constructor(public dialogRef: MatDialogRef<DialogLoginComponent>, private authService: AuthService) {
    this.cashierToken = this.authService.token;
    this.rol = this.authService.adminRoles;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close({valid: true, token: this.cashierToken});
  }

  ngOnDestroy() {
    //this.cashierToken = undefined;
  }
}
