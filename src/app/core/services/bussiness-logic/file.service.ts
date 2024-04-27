import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, ReplaySubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  //@Output() onFileRead :EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) {
  }

  onReadFileReadme(): Observable<any> {
    return this.http.get('/assets/readme.md');
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event!.target!.result!.toString()!));
    return result;
  }

}
