import {Component} from '@angular/core';
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {AuthService} from "@core/services/api/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-rpt-black',
  templateUrl: './rpt-black.component.html',
  styleUrls: ['./rpt-black.component.css']
})
export class RptBlackComponent {
  constructor(
    private router: Router,
    private authService: AuthService) {

    this.authService.adminLogged()
      ? this.router.navigateByUrl("/home/layout/reports/dashboard")
      : this.router.navigateByUrl("/home/layout/reports/rptclockshift")

  }

}
