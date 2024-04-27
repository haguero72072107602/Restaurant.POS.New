import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {AuthRoutingModule} from './auth-routing.module';
import {MasterLoginComponent} from './containers/master-login/master-login.component';
import {UserLoginComponent} from './containers/user-login/user-login.component';
import {SharedModule} from "@shared/shared.module";
import {InfoUserComponent} from './component/info-user/info-user.component';
import {PasswordUserComponent} from './component/password-user/password-user.component';
import {NoteUserComponent} from './component/note-user/note-user.component';
import {ClockInUserComponent} from './component/clock-in-user/clock-in-user.component';
import {ClockOutUserComponent} from './component/clock-out-user/clock-out-user.component';
import {LayoutComponent} from './component/layout/layout.component';
import {ProccessLoginComponent} from './component/proccess-login/proccess-login.component';
import {SliderPhotoComponent} from "@modules/home/component/slider-photo/slider-photo.component";

//import {DatePipe, NgIf} from "@angular/common";

@NgModule({
  declarations: [
    MasterLoginComponent,
    UserLoginComponent,
    LayoutComponent,
    InfoUserComponent,
    NoteUserComponent,
    ClockOutUserComponent,
    ClockInUserComponent,
    ProccessLoginComponent,
    PasswordUserComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    SliderPhotoComponent,
    //DatePipe,
    //NgIf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {
}
