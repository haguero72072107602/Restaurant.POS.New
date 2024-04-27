import {EventEmitter, Injectable, Output} from '@angular/core';
import {arraySplit} from "@models/split.model";

@Injectable({
  providedIn: 'root'
})
export class SplitService {
  split?: any[][] = [];

  reverseSplit: any[][] = [];

  get getSplit() {
    return this.split!
  }

  onPurgeSplit() {
    this.split! = []
  }

  onAddSplit(arr: arraySplit[]) {
    this.split!.push(arr);
  }

  onSetReverseSplit(arr: arraySplit[]) {
    this.reverseSplit.push(arr)
  }
}
