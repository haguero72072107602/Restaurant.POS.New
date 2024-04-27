import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  SecurityContext,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '@core/services/api/auth.service';
import {InvoiceService} from '@core/services/bussiness-logic/invoice.service';
import {UserrolEnum} from '@core/utils/userrol.enum';
import {OperationsService} from '@core/services/bussiness-logic/operations.service';
import {DataStorageService} from '@core/services/api/data-storage.service';
import {SwiperContainer} from 'swiper/element';
import {DialogService} from '@core/services/bussiness-logic/dialog.service';
import {DialogConfirm, DialogType} from '@core/utils/dialog-type.enum';
import {SliderImage} from "@models/slider-image.model";
import {DomSanitizer} from "@angular/platform-browser";
import {SliderPhotoComponent} from "@modules/home/component/slider-photo/slider-photo.component";
import {ConfigurationService} from "@core/services/bussiness-logic/configuration.service";

@Component({
  selector: 'app-password-user',
  templateUrl: './password-user.component.html',
  styleUrls: ['./password-user.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PasswordUserComponent implements OnInit, AfterViewInit {

  public passwordInput: string = '';
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;
  @ViewChild('sliderPhoto', {static: true}) sliderPhoto!: SliderPhotoComponent;
  protected username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private invoiceService: InvoiceService,
    private operationService: OperationsService,
    public dataStore: DataStorageService,
    private dialogService: DialogService,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit(): void {
    this.authService.clearUser();
  }

  ngAfterViewInit(): void {
    /*
    this.authService.getUsersList().subscribe((nextUser: UserList[]) => {
      nextUser.map((item, index) => {

        //const image = 'data:image/jpg;base64, ' + item.image;

        const newUser: SliderImage = {
          id: item.posUserId,
          userName: item.firstName!,
          imgSrc: item.image,
          imgAlt: 'slider' + index
        }
        this.images.push(newUser)
      });
    });
    */
  }

  isListUserActive() {
    return this.configurationService.sysConfig !== undefined
  }

  onLoginUser() {
    const roleAdmin = [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR];
    this.authService
      .login({username: this.username, password: this.passwordInput})
      .subscribe(
        (t: any) => {
          console.log('login user ->', t);
          //this.authService.dataUser = {username: 'user', password: this.passwordInput};
          this.invoiceService.resetSelection();

          console.log("Includes", roleAdmin.includes(this.authService.token!.rol))
          roleAdmin.includes(this.authService.token!.rol)
            ? this.operationService.gotoRouter()
            : this.router.navigateByUrl('/auth/users/infouser');
        },
        (error: any) => {
          this.onKeyPress('C');
          console.log("Error", error);
          this.dialogService.openGenericAlert(
            DialogType.DT_ERROR,
            'Error !',
            'Error in user accreditation. Please re-register...',
            null,
            DialogConfirm.BTN_CLOSE
          );
          console.log(error);
        }
      );
  }

  onKeyPress(s: string) {
    switch (s) {
      case 'C':
        this.passwordInput = '';
        break;
      case 'X':
        this.passwordInput.slice(0);
        if (this.passwordInput.length > 0) {
          this.passwordInput = this.passwordInput.slice(
            0,
            this.passwordInput.length - 1
          );
        }
        break;
      default:
        this.passwordInput += s;
        break;
    }

    if (this.passwordInput.length == 4) {
      this.onLoginUser();
    }
  }

  activeUser($event: SliderImage) {
    console.log('Active user -> ', $event);
    this.username = $event.userName;
    this.authService.imageUser = $event.imgSrc!
  }
}
