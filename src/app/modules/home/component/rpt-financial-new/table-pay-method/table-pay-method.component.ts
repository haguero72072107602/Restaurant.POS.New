import {Component, Input} from '@angular/core';
import {MediaData} from "@models/media.data";
import {MediaDataViewModels} from "@models/financials/financialReport.model";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-table-pay-method',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './table-pay-method.component.html',
  styleUrl: './table-pay-method.component.css'
})
export class TablePayMethodComponent {
  //@Input({required: true}) payMethod : number | undefined
  @Input({required: true}) mediaDataView: MediaDataViewModels[] | undefined

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  onGroupByPayment(items: MediaDataViewModels[]) {
    const value = this.groupBy(items, i => i.paymentType);
    const look = Object.keys(value);//.sort(this.compareNumbers);
    return look.map((str) => {
      return str
    });
  }

  filterMedia(mediaDataView: MediaDataViewModels[], payment: string) {
    return mediaDataView.filter(h => h.paymentType === payment)
  }

  sumMedia(mediaDataView: MediaDataViewModels[], payment: string) {
    return mediaDataView.filter(h => h.paymentType === payment)
      .reduce((a: number, b: MediaDataViewModels) => {
        return a + b.total
      }, 0)
  }
}
