import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {
  //@Output() onFileRead :EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) {
  }

  onReadFileReadme(): Observable<any> {
    return this.http.get('/assets/readme.md');
  }

}
