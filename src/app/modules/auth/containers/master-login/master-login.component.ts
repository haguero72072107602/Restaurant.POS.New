import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@core/services/api/auth.service";
import {Router} from "@angular/router";
import {WebsocketService} from "@core/services/api/websocket.service";

@Component({
  selector: 'app-master-login',
  templateUrl: './master-login.component.html',
  styleUrls: ['./master-login.component.css']
})
export class MasterLoginComponent implements OnDestroy {

  public loginForm: FormGroup;

  //private observable$: Subscription = any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public formBuilder: FormBuilder,
    private websocket: WebsocketService,
    private authService: AuthService) {
    this.loginForm = formBuilder.group(
      {
        userName: ['admin', Validators.required],
        password: ['admin', Validators.required]
      }
    );
  }

  get fmLogin() {
    return this.loginForm.controls;
  }

  get userName() {
    return this.loginForm.get("userName")
  }

  get password() {
    return this.loginForm.get("password")
  }

  ngOnDestroy(): void {
    //this. observable$.next
  }

  loginMaster() {
    if (this.loginForm.get("userName")?.value == 'admin' && this.loginForm.get("password")?.value == 'admin') {
      this.router.navigateByUrl('auth/users/loginuser');
    } else {
    }
  }
}


