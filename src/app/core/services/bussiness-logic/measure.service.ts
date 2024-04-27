import {Injectable} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Measure} from "@models/measure.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MeasureService {
  constructor(
    private dataStorage: DataStorageService,
    private sanitizer: DomSanitizer) {
  }

  getMeasures(): Observable<Measure[]> {
    return this.dataStorage.getMeasures();
  }


  getAssociatedMeasures(idMeasure: string): Observable<Measure[]> {
    return this.dataStorage.getAssociatedMeasures(idMeasure);
  }

}



