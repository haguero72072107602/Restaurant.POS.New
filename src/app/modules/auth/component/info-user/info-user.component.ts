import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NoteUserComponent} from '@modules/auth/component/note-user/note-user.component';
import {ClockService} from '@core/utils/clock.service';
import {EClockType} from '@core/utils/clock-type.enum';
import {InformationType} from '@core/utils/information-type.enum';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {AuthService} from '@core/services/api/auth.service';
import {User} from '@models/user.model';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';
import {CashService} from '@core/services/bussiness-logic/cash.service';
import {dateFormatter} from '@core/utils/functions/transformers';
import {WorkerRecords} from '@models/worker-records';
import {ClockInUserComponent} from '@modules/auth/component/clock-in-user/clock-in-user.component';
import {PaymentMethodEnum} from '@core/utils/operations/payment-method.enum';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.css'],
})
export class InfoUserComponent implements OnInit {
  @ViewChild('btnClockIn') btnClockIn?: ElementRef;
  @ViewChild('btnClockOut') btnClockOut?: ElementRef;

  public dateInformation?: Date;
  public progressClockIn: boolean = false;
  public progressClockOut: boolean = false;
  public dateNow?: Date = new Date();
  public enableClockIn: boolean = true;
  public user: User = {};
  public imageUser?: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    public dataStore: DataStorageService,
    private operationService: OperationsService,
    private dialogService: DialogService,
    private authService: AuthService,
    private utils: DialogService,
    private clockService: ClockService
  ) {
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('token');
    const user = JSON.parse(userString ? userString : '');

    this.clockService.getDate.subscribe((date) => {
      this.dateInformation = date;
    });
    this.dataStore.getApplicationUsers().subscribe((next: User[]) => {

      let userSelected = next
        .filter(nextUser => nextUser.userName?.trim() == this.authService.token!.username!.trim())[0];

      if (userSelected!) {
        this.imageUser = 'data:image/jpg;base64, ' + userSelected.image;

        let date = dateFormatter(this.dateNow).split(",")[0];
        this.dataStore.getWorkerRecordsByUser(userSelected!.id, date).subscribe((next: WorkerRecords[]) => {
          console.log(next);
          this.enableClockIn = (next.length % 2 == 0);
          this.setStateBuutons();
        });
      }
    }, error1 => {
      this.dialogService.openGenericInfo('Error', error1);
    });


    /*this.authService.getUserId(user.user_id).subscribe((user) => {
      console.log("User logged", user);
      if (user.posUserId !==undefined ) {
        this.enableClockIn = false;
      } else {
        this.enableClockIn = true;
      }
    });*/


    this.user = user ? user : '';
    this.user.fullName = user.fullname;
  }

  setStateBuutons() {
    this.btnClockIn!.nativeElement!.disabled = !this.enableClockIn;
    this.btnClockOut!.nativeElement!.disabled = this.enableClockIn;
  }

  gotoPassword() {
    !this.enableClockIn
      ? this.operationService.gotoRouter()
      : this.router.navigateByUrl('/auth/users/loginuser');
  }

  onShowNoteUser() {
    this.dialog.open(NoteUserComponent, {hasBackdrop: true});
  }

  onViewDialog() {
    return this.dialog.open(ClockInUserComponent, {
      width: '289px',
      height: '316px',
      data: {},
      disableClose: true,
    });
  }

  onClockIn() {
    this.progressClockIn = true;
    this.clockInOut(EClockType.IN);
  }

  onClockOut() {
    this.progressClockOut = true;
    this.clockInOut(EClockType.OUT);
  }

  clockInOut(ev: EClockType) {
    console.log('clockInOut', ev, this.authService.getUserActive!.password);
    const dialog = this.router.navigateByUrl('/auth/users/loading');

    this.dataStore
      .employClock(
        {
          username: this.authService.getUserActive!.username,
          password: this.authService.getUserActive!.password,
        },
        ev
      )
      .subscribe(
        (next: any) => {
          this.progressClockIn = false;
          this.progressClockOut = false;
          let token = this.authService.decodeToken(next.token);
          console.log(next, token);


          ev === EClockType.IN
            ? this.operationService.gotoRouter()
            : this.router.navigateByUrl('/auth/users/loginuser');
        },
        (error1) => {

          console.error(error1);
          this.progressClockIn = false;
          this.progressClockOut = false;
          this.enableClockIn = false;
          this.utils.openGenericInfo(InformationType.ERROR, error1);
        }
      );
  }

  showClockMsg(msg: string) {
    this.utils.openGenericInfo(InformationType.INFO, msg);
  }
}
