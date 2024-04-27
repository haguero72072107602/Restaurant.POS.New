import {NgModule} from '@angular/core';
import {RouterModule, Routes, withViewTransitions} from '@angular/router';

const routes: Routes = [
  {
    path: "", redirectTo: "auth", pathMatch: "full"
  },
  {
    "path": "auth",
    loadChildren: () => import("./modules/auth/auth.module").then(value => value.AuthModule)
  },
  {
    "path": "home",
    loadChildren: () => import("./modules/home/home.module").then(value => value.HomeModule)
  },
  {
    "path": "settings",
    loadChildren: () => import("./modules/settings/settings.module").then(value => value.SettingsModule)
  },
  {
    path: "**", redirectTo: "ErrorPage", pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    bindToComponentInputs: true,
    enableViewTransitions: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
