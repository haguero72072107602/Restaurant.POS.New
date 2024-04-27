import {Injectable, Sanitizer, SecurityContext} from '@angular/core';
import {DataStorageService} from "@core/services/api/data-storage.service";
import {Table} from "@models/table.model";
import {AuthService} from "@core/services/api/auth.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {Observable} from "rxjs";
import {catchError} from "rxjs/operators";
import {LocalLayout} from "@models/local.layout.model";

@Injectable({
  providedIn: 'root'
})
export class LocalLayoutService {

  constructor(
    private dataStore: DataStorageService,
    private cashService: CashService
  ) {
  }

  getLocalLayoutByUser(posUserId: string): Observable<LocalLayout[]> {
    return this.dataStore.getLocalLayoutByUser(posUserId)
  }

  getLocalLayout(): Observable<LocalLayout[]> {
    return this.dataStore.getLocalLayout();
  }


}
