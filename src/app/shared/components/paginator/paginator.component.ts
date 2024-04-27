import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Theme} from 'src/app/models/theme';

@Component({
  selector: 'pos-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  @Input() page = 1;
  @Input() countElements?: number;
  @Input() sizePage = 12;
  @Input() disabled = false;
  @Output() evSetPage = new EventEmitter<number>();
  @Input() idPage?: string;

  theme: string = this.th.theme;

  constructor(private th: Theme) {
  }

  ngOnInit() {
  }

  setPage(ev: any) {
    this.page = ev;
    this.evSetPage.emit(ev);
  }

  next(paginator: any) {
    if (!paginator.isLastPage()) {
      paginator.next();
    }
  }

  previous(paginator: any) {
    if (!paginator.isFirstPage()) {
      paginator.previous();
    }
  }

}
