import {Component, EventEmitter, Input, Output} from '@angular/core';
import {arraySplit} from "@models/split.model";

@Component({
  selector: 'app-card-arr-split',
  templateUrl: './card-arr-split.component.html',
  styleUrls: ['./card-arr-split.component.css']
})
export class CardArrSplitComponent {
  @Input() arrPosition: arraySplit[] = [];

  @Output() evSelectSplit: EventEmitter<arraySplit[]> = new EventEmitter<arraySplit[]>();

  selectedCard: boolean = false;

  onSelected() {
    this.selectedCard = !this.selectedCard;
    this.evSelectSplit!.emit(this.arrPosition);
  }
}
