import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserLoginComponent} from './containers/user-login/user-login.component';
import {MasterLoginComponent} from './containers/master-login/master-login.component';
import {InfoUserComponent} from './component/info-user/info-user.component';
import {PasswordUserComponent} from './component/password-user/password-user.component';
import {LayoutComponent} from './component/layout/layout.component';
import {ProccessLoginComponent} from './component/proccess-login/proccess-login.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'master', pathMatch: 'full',
  },
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'master',
        component: MasterLoginComponent,
      },
      {
        path: 'users', component: UserLoginComponent,
        children: [
          {
            path: 'loginuser',
            component: PasswordUserComponent,
          },
          {
            path: 'infouser',
            component: InfoUserComponent,
          },
          {
            path: 'loading',
            component: ProccessLoginComponent,
          },
          {
            path: '', redirectTo: 'infouser', pathMatch: "full"
          }
        ],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
