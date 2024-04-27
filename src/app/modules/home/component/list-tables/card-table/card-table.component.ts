import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, SecurityContext} from '@angular/core';
import {Table} from "@models/table.model";
import {TablesService} from "@core/services/bussiness-logic/tables.service";
import {AuthService} from "@core/services/api/auth.service";
import {UserList} from "@models/userList";
import {DomSanitizer} from "@angular/platform-browser";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";
import {Subscription} from "rxjs";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {Router} from "@angular/router";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css']
})
export class CardTableComponent implements OnInit, OnDestroy {

  @Input() table?: Table;
  @Input() layoutType: number = 1;
  @Output() evUpdateLayout: EventEmitter<number> = new EventEmitter<number>();

  image?: string | any;
  nameUser?: string;

  cardSelected: boolean = false;
  private sub: Subscription[] = [];

  constructor(private router: Router,
              private colorsService: ColorsService,
              private tableService: TablesService,
              private operationService: OperationsService,
              private authService: AuthService,
              private dialogService: DialogService,
              private sanitizer: DomSanitizer) {
  }

  get isAdministrator() {
    return ([UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR].includes(this.authService.token?.rol!))
  }

  ngOnInit(): void {
    this.onGetPhotoUser();

    this.sub.push(this.tableService.getTableObservable.subscribe((response: Table[]) => {
      this.onChangeTable(response)
    }));

    //if (this.invoiceService.receiptNumber === undefined || this.invoiceService.receiptNumber.trim() === "") {
    //  this.invoiceService.createInvoice(undefined, undefined, undefined);
    //}
  }

  onGetPhotoUser() {
    if (this.table?.posUserId) {
      console.log(this.table?.posUserId);
      this.authService.getUserId(this.table?.posUserId).subscribe((next: UserList) => {
        if (next) {
          this.image = next!.image ? this.sanitizer.sanitize(SecurityContext.NONE,
              this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64, ' + next!.image))
            : "./assets/user.jpg";
          this.nameUser = next!.firstName;
        }
      }, error => {
        this.dialogService.openGenericInfo("Error", error)
      })
    }
  }

  onSelected($event: MouseEvent) {
    $event.stopPropagation();
    this.cardSelected = !this.cardSelected;
    this.table!.selected = this.cardSelected;
    this.tableService.setTableSelected(this.table!);

    /*
    const operator = [UserrolEnum.CASHIER, UserrolEnum.WORKER,
      UserrolEnum.SUPERVISOR, UserrolEnum.DEPENDENT];

    if (operator.includes(this.authService.token!.rol)) {
      this.invoiceService.setDineIn(this.table!).subscribe((next: Order) => {
        this.invoiceService.order = next;
        this.searchService.setActivated(0);
        this.router.navigateByUrl("/home/layout/invoice/departaments");
      }, error => {
        this.cashService.openGenericInfo("Error", error)
      });
    }
    */
  }

  onMinus($event: MouseEvent) {
    $event.stopPropagation();
    if (this.tableService.layoutActive && this.table!.chairNumber! > 0) {
      this.updateTable(this.table!, this.table!.chairNumber! - 1);
      this.evUpdateLayout.emit(-1);
    }
  }

  onPlus($event: MouseEvent) {
    $event.stopPropagation();
    if (this.tableService.layoutActive &&
      (this.tableService.layoutActive?.usedChairNumber! + 1) <= this.tableService.layoutActive?.totalChairNumber!) {
      if (this.layoutType === 1) {
        this.updateTable(this.table!, this.table!.chairNumber! + 1)
        this.evUpdateLayout.emit(1);
      } else {
        if (this.table!.chairNumber! < 1) {
          this.updateTable(this.table!, this.table!.chairNumber! + 1)
          this.evUpdateLayout.emit(1);
        }
      }
    }
  }

  updateTable(table: Table, count: number) {
    const tblSend = {...table, chairNumber: count};
    this.tableService.setUpdateTable(tblSend).subscribe((next: Table) => {
      this.table = next;
    }, (error: any) => {
      this.dialogService.openGenericInfo("Error", error)
    });
  }

  getColorBorder(status: number) {
    return status === 0 ? "border-color: " + this.colorsService.getColorStatus(status, 1) :
      "border-color: " + this.colorsService.getColorStatus(status)
  }

  getColorBackground(status: number) {
    return status === 0 ? "background-color: " + this.colorsService.getColorStatus(status, 1) :
      "background-color: " + this.colorsService.getColorStatus(status);
  }

  getColorText(status: number) {
    return status === 0 ? "color: " + this.colorsService.getColorStatus(status, 1) :
      "color: " + this.colorsService.getColorStatus(status)
  }

  getColorCircle(status: number) {
    return "color: " + this.colorsService.getColorStatus(status, 0) + "; " +
      "background-color: " + this.colorsService.getColorStatus(status, 1) + "; background-opacity: 0.1;";
  }

  ngOnDestroy(): void {
    this.sub.map(sub => sub.unsubscribe());
  }

  private onSelectedTable(reponse: Table) {
    if (this.table!.id != reponse.id) {
      this.cardSelected = false;
    }
  }

  private onChangeTable(response: Table[]) {
    if (response!.length > 0) {
      if (![UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR].includes(this.authService.token!.rol!)) {
        this.cardSelected = this.table!.id === response[0]!.id
      } else {
        response.forEach(t => {
          if (t.id === this.table!.id) {
            this.table = Object.assign(t);
            this.cardSelected = false;
            this.onGetPhotoUser();
          }
        })
      }
    }
  }
}


