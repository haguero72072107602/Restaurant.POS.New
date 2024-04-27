import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {IAggregateProduct} from '../../../models/options.model';
import {Theme} from 'src/app/models/theme';
import {ETXType} from "@core/utils/delivery.enum";

@Component({
  selector: 'list-invoices',
  templateUrl: './list-invoices.component.html',
  styleUrls: ['./list-invoices.component.scss']
})
export class ListInvoicesComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() sizePage?: number;
  @Input() page?: number;
  @Input() idPage?: string;
  @Input() label = 'receiptNumber';
  @Input() detail?: string;
  @Input() subdetail?: string;
  @Input() extradetail?: string;
  @Input() breakText?: string;
  @Input() multiselection = false;
  @Input() closeAfterSelect = true;
  @Input() itemsSelected: any[] = [];
  @Input() limitSides?: number;
  @Input() amountSides?: number;
  @Output() evCloseDialog = new EventEmitter<any>();
  @Input() lengthText: number = 30;
  currencyProps = ['total', 'unitCost', 'balance', 'creditLimit', 'credit', 'giftAmount'];
  dateProps = ['date', 'fromDate', 'toDate'];

  theme: string = this.th.theme;

  constructor(private th: Theme) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('onChange', changes);
  }

  ngOnInit() {
    console.log('limitSides', this.limitSides);
    if (!this.itemsSelected) {
      this.itemsSelected = [];
    }
  }

  setColor(type: any) {
    switch (type) {
      case ETXType.DELIVERY:
        return 'green';
      case ETXType.PICKUP:
        return 'yellow';
      default:
        return 'red';
    }
  }

  select(ev: any, i: any) {
    console.log('select', ev, i);
    if (this.amountSides) {
      console.log('amountSides');
    }
    this.multiselection ? this.addSelection(i) : this.setSelection(i);
  }

  addSelection(i: any) {
    this.checkSelected(i) ? this.removeSelection(i) : this.addOption(i);
  }

  removeSelection(i: any) {
    this.itemsSelected.splice(this.itemsSelected.findIndex((v) => v.id === i.id), 1);
    i.selected = false;
    i.count = 0;
  }

  setSelection(i: any) {
    this.itemsSelected[0] = i;
    const item = this.data.invoice.find((inv: any) => inv.selected);
    if (item && item.selected) {
      item.selected = false;
    }
    if (this.closeAfterSelect) {
      this.evCloseDialog.emit(i);
    }
  }

  checkSelected(i: any) {
    return this.itemsSelected ? this.itemsSelected.includes(i) : false;
  }

  addOption(i: any) {
    if (this.limitSides !== undefined && this.itemsSelected.length >= this.limitSides) {
      this.itemsSelected.splice(0, 1);
    }
    i.count = !i.count ? 1 : i.count + 1;
    this.itemsSelected.push(i);
    console.log('addOption', this.itemsSelected);
  }

  setCount(ev: any, i: any) {
    console.log('setCount', ev, i);
    i.selected = (ev > 0) ? true : false;
    if (ev > 0 && !this.checkSelected(i)) {
      this.addOption(i);
    } else if (ev > 0) {
      this.itemsSelected[this.itemsSelected.findIndex(v => v.id === i.id)].count = ev;
    } else if (ev <= 0 && this.checkSelected(i)) {
      this.removeSelection(i);
    }
  }

  hideBadge(i: IAggregateProduct) {
    return i.count === 0 && this.amountSides;
  }
}
