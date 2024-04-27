import {Injectable} from '@angular/core';
import {DataStorageService} from "../api/data-storage.service";
import {CashService} from "./cash.service";

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  constructor() {
  }

  loadScripts(files: string[]) {
    for (let file of files) {
      let script = document.createElement("script");
      script.src = "./assets/js/" + file + ".js";
      let body = document.getElementsByTagName("body")[0];
      body.appendChild(script);
    }
  }
}
