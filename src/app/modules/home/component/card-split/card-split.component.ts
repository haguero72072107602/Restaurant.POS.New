import {Component, Inject, Input} from '@angular/core';
import {arraySplit} from "@models/split.model";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";


@Component({
  selector: 'app-card-split',
  templateUrl: './card-split.component.html',
  styleUrls: ['./card-split.component.css']
})
export class CardSplitComponent {
  @Input() position?: arraySplit = {id: 1, selected: false, visible: true};

  constructor(private operationService: OperationsService) {
  }

  onSelected() {
    console.log(this.position!.selected);
    this.position!.selected = !this.position?.selected;
  }
}
