import {Component, Input} from '@angular/core';
import {MediaData} from "@models/media.data";

@Component({
  selector: 'app-table-pay-method',
  standalone: true,
  imports: [],
  templateUrl: './table-pay-method.component.html',
  styleUrl: './table-pay-method.component.css'
})
export class TablePayMethodComponent {
  //@Input({required: true}) payMethod : number | undefined
  @Input({required: true}) payMethodData : MediaData[] | undefined


  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  onGroupByPayment(items: any[]) {
    const value = this.groupBy(items, i => i.position);
    const look = Object.keys(value);//.sort(this.compareNumbers);
    return look.map((str) => {
      return parseInt(str)
    });
  }
}
