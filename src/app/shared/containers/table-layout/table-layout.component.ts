import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {InformationType} from '../../../utils/information-type.enum';
import {AuthService} from '../../../services/api/auth.service';
import {RestaurantService} from '../../../services/bussiness-logic/restaurant.service';
import {Table} from '../../../models/table.model';
import {Observable, of, Subscription} from 'rxjs';
import {FinancialOpEnum} from '../../../utils/operations';
import {ETXType} from '../../../utils/delivery.enum';
import {Theme} from 'src/app/models/theme';
import {CashService} from 'src/app/services/bussiness-logic/cash.service';

@Component({
  selector: 'app-table-layout',
  templateUrl: './table-layout.component.html',
  styleUrls: ['./table-layout.component.scss']
})
export class TableLayoutComponent implements OnInit, OnDestroy {
  @Input() columns = 5;
  tables: Array<Table>;
  groupTables = [];
  @Input() restaurantOperations = [
    ETXType[ETXType.DELIVERY],
    ETXType[ETXType.PICKUP],
    ETXType[ETXType.FAST_FOOD],
    ETXType[ETXType.RETAIL],
    FinancialOpEnum.RECALL,
    FinancialOpEnum.MANAGER,
    FinancialOpEnum.LOGOUT
  ];
  @Input() restaurantColor = ['color2', 'color2', 'color2', 'color2', 'color6', 'color4', 'color4'];
  tableSize: any;
  sub = new Array<Subscription>();
  tables$: Observable<any>;
  theme: string = this.th.theme;
  operation: FinancialOpEnum | ETXType;

  constructor(private th: Theme, private router: Router, private authService: AuthService,
              private restaurantService: RestaurantService, private cashService: CashService) {

    // Subscription to sendAck event
    this.sub.push(this.restaurantService.sendAck().subscribe(
      next => console.log('sendAck', next), err => console.error(err)
    ));
    // Subscription to logout event
    this.sub.push(this.cashService.evLogout.subscribe(ev => {
      console.log('logout', ev);
      this.restaurantService.invoiceServ.logoutOpResponse();
    }, error => {
      this.restaurantService.utilsServ.openGenericInfo(InformationType.ERROR, error);
    }));

    this.restaurantService.tables().subscribe(
      next => {
        this.tables = next;
        this.tables$ = of(next);
        this.computeTableSize();
      }, error => this.restaurantService.utilsServ.openGenericInfo(InformationType.ERROR, error)
    );

    if (!this.cashService.config.sysConfig.allowRetailInRestaurant) {
      this.restaurantOperations.splice(3, 1);
      this.restaurantColor.splice(3, 1);
    }
  }

  ngOnInit() {
  }

  setTable(table: Table) {
    this.setOrder(ETXType.DINEIN, table.id);
  }

  setOrder(type: ETXType, table?: string) {
    console.log('setOrder', type, table);
    this.restaurantService.setOrder(type, table, () => this.createdInvoice());
  }

  operationKey($event: any) {
    console.log('customerKey', $event);
    switch ($event) {
      case ETXType[ETXType.DELIVERY]:
        this.setOrder(ETXType.DELIVERY);
        break;
      case ETXType[ETXType.PICKUP]:
        this.setOrder(ETXType.PICKUP);
        break;
      case ETXType[ETXType.FAST_FOOD]:
        this.setOrder(ETXType.FAST_FOOD);
        break;
      case ETXType[ETXType.RETAIL]:
        this.setOrder(ETXType.RETAIL);
        break;
      case FinancialOpEnum.RECALL:
        this.recall();
        break;
      case FinancialOpEnum.MANAGER:
        this.operation = FinancialOpEnum.MANAGER;
        this.setOrder(ETXType.DINEIN);
        break;
      case FinancialOpEnum.LOGOUT:
        this.logout();
        break;
    }
  }

  updatedOrder(next: ETXType) {
    console.log('updatedOrder', next);
    if ([ETXType.DELIVERY, ETXType.PICKUP].includes(next)) {
      this.router.navigateByUrl('/cash/order');
    }
  }

  logout() {
    this.authService.logout().subscribe(value => {
      console.log('logoutOp', value);
      this.restaurantService.invoiceServ.logoutOpResponse();
    }, error1 => {
      console.error('LogoutOp', error1);
    });
  }

  ngOnDestroy(): void {
    this.sub.map(sub => sub.unsubscribe());
  }

  private computeTableSize() {
    const length = this.tables.length;
    this.tableSize = (length <= 8) ? 'big' : (length <= 15) ? 'medium' : 'small';
  }

  private createdInvoice(inv?: any) {
    console.log('createdInvoiceWithOrder', inv);
    if (this.restaurantService.operationType === ETXType.PICKUP) {
      this.restaurantService.invoiceServ.pickUp(() => this.updatedOrder(ETXType.PICKUP));
    } else if (this.restaurantService.operationType === ETXType.DELIVERY) {
      this.restaurantService.invoiceServ.delivery(() => this.updatedOrder(ETXType.DELIVERY));
    } else if (this.restaurantService.operationType === ETXType.DINEIN && this.operation === FinancialOpEnum.MANAGER) {
      this.manager();
    } else {
      this.router.navigateByUrl('cash/order');
    }
  }

  private recall() {
    this.restaurantService.recallCheck();
  }

  private manager() {
    this.operation = null;
    this.restaurantService.manager();
  }
}
