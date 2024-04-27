import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {leaveFocusOnButton} from "@core/utils/functions/functions";

@Component({
  selector: 'numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss']
})
export class NumpadComponent implements OnInit {
  @Input() lastKey: string | any;
  @Input() colors: string | string[] = [];
  @Input() disableOp = false;
  @Output() evPressKeys = new EventEmitter<any>();
  @Input() numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "00"];
  @Input() widthKey = '100px';

  constructor(private op: OperationsService) {
  }

  ngOnInit() {
    this.numbers.push(this.lastKey);
  }

  pressKey(ev: any, val: string | number) {
    //console.log(val);
    leaveFocusOnButton(ev);
    this.evPressKeys.emit(val);
    this.op.resetInactivity(true, 'numpad');
  }

}
