import {EventEmitter, Injectable, Output} from '@angular/core';
import {AuthService} from '../api/auth.service';
import {DataStorageService} from '../api/data-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {CashService} from './cash.service';
import {ETXType} from '../../utils/delivery.enum';
import {Router} from '@angular/router';
import {ProductOrder} from '@models/product-order.model';
import {Table} from '@models/table.model';
import {TablesService} from '@core/services/bussiness-logic/tables.service';
import {SearchService} from '@core/services/bussiness-logic/search.service';
import {SelectionModel} from '@angular/cdk/collections';
import {OperationType} from '@models/operation-type';
import {PositionType} from '@models/position-type';
import {UserPosition} from '@core/utils/user-position.enum';
import {AdminOperationService} from '@core/services/api/admin.operation.service';
import {baseURL} from '../../utils/url.path.enum';
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {User} from '@models/user.model';
import {AdminOptionsService} from '@core/services/bussiness-logic/admin-options.service';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  userId!: string;
  userName!: string;
  cardCode!: string;
  cardDigit!: string;

  items: PositionType[] = [
    {title: 'Owner', id: UserPosition.OWNER},
    {title: 'Manager', id: UserPosition.MANAGER},
    {title: 'Supervisor', id: UserPosition.SUPERVISOR},
    {title: 'Cashier Retail', id: UserPosition.CASHIER_RETAIL},
    {title: 'Worker', id: UserPosition.WORKER},
  ];

  public selectionModel = new SelectionModel<OperationType>(true, [
    this.items[0],
    this.items[1],
  ]);

  @Output() evAddProd = new EventEmitter<ProductOrder>();
  @Output() evDelProd = new EventEmitter<any>();
  @Output() evDelAllProds = new EventEmitter<any>();
  @Output() evNumpadInput = new EventEmitter<any>();
  @Output() evAddProdByUPC = new EventEmitter<any>();
  @Output() evChkPriceProdByUPC = new EventEmitter<any>();
  @Output() evUpdateTotals = new EventEmitter<any>();
  @Output() evUpdateProds = new EventEmitter<ProductOrder[]>();
  @Output() evEditRestaurantOp = new EventEmitter<any>();
  @Output() evCreateInvoice = new EventEmitter<boolean>(false);
  @Output() evSelectedTable = new EventEmitter<Table>();
  @Output() evNewInvoice = new EventEmitter<boolean>(false);

  lastProdAdd!: ProductOrder | null;
  evSetOrder = new BehaviorSubject<ETXType>(ETXType.RETAIL);
  evTableLayot = new BehaviorSubject<boolean>(false);

  constructor(
    public authService: AuthService,
    private dataStorage: DataStorageService,
    public cashService: CashService,
    private dialogService: DialogService,
    public tableService: TablesService,
    private adminService: AdminOptionsService,
    private searchService: SearchService,
    private router: Router
  ) {
  }


  createUser(data: any): Observable<User> {
    return this.adminService.createUser(data);
    /*this.adminService.employSetup(baseURL, data).subscribe(next => {
      console.log('getEmploye', next);

      this.userName = next.userName;
      return next;
    }, error1 => {

      this.dialogService.openGenericAlert('Error', 'Can\'t add the employe', null, "warn");
    });*/
  }

  updateUser(data: any): Observable<User> {
    return this.adminService.updateUser(data);
    /*this.adminService.employUpdate(baseURL, data).subscribe(next => {
      console.log('getEmploye', next);
      this.userId = next.id;
      return next;
    }, error1 => {
      this.dialogService.openGenericAlert('Error !', 'Can\'t edit the employe', null, "warn");
    });*/
  }

  deleteUser(id: string): Observable<User> {

    return this.adminService.deleteUser(id);
    /*this.adminService.employDelete(baseURL, id).subscribe(next => {
      console.log('getEmploye', next);
      this.userId = next.id;
      return next;
    }, error1 => {
      this.dialogService.openGenericAlert('Error !', 'Can\'t delete the employe', null, "warn");
    });*/
  }
}
