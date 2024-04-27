import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Category} from "@models/category.model";
import {HttpClient} from "@angular/common/http";
import {ProcessHTTPMSgService} from "@core/services/api/ProcessHTTPMSg.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  path = '/CategoryComponents';

  constructor(private _http: HttpClient, private processHttpMsgService: ProcessHTTPMSgService) {
  }

  getCategories(url: string): Observable<Category[]> {
    return this._http.get<Category[]>(url + this.path + '/')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
