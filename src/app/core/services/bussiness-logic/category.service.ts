import {Injectable} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {Category} from "@models/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private dataStorage: DataStorageService,
    private sanitizer: DomSanitizer) {
  }

  getCategories(): Observable<Category[]> {
    return this.dataStorage.getCategories();
  }

}



