import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {AuthService} from '@core/services/api/auth.service';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';
import {ClockService} from '@core/utils/clock.service';
import {User} from '@models/user.model';

@Component({
  selector: 'app-proccess-login',
  templateUrl: './proccess-login.component.html',
  styleUrls: ['./proccess-login.component.css']
})
export class ProccessLoginComponent implements OnInit {

  public user: User = {};

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public dataStore: DataStorageService,
    private authService: AuthService,
    private utils: DialogService,
    private clockService: ClockService
  ) {
  }


  ngOnInit(): void {

    const userString = localStorage.getItem('token');
    const user = JSON.parse(userString ? userString : '');


    this.user = user ? user : '';
    this.user.fullName = user.fullname;
  }

  onCancel() {

  }
}
