import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {leaveFocusOnButton} from "@core/utils/functions/functions";


@Component({
  selector: 'operation-group',
  templateUrl: './operation-group.component.html',
  styleUrls: ['./operation-group.component.scss']
})
export class OperationGroupComponent implements OnInit, OnChanges {
  @Input() operations: string[] = [];
  @Input() colors: string | string[] = [];
  @Input() disable: boolean | boolean[] = false;
  @Input() layout: string | any;
  @Input() btnSize: string = "100px";
  @Input() upperCase: boolean = false;
  @Input() showText: boolean = true;
  @Input() showElements: boolean = true;
  @Output() evPressKeys = new EventEmitter<any>();

  constructor() {
  }

  ngOnChanges(sc: SimpleChanges) {
    //console.log('onchanges', sc);
    /*if(sc['operations']){
      this.setUpperCase();
    }*/
  }

  ngOnInit() {
    this.setUpperCase();
  }

  setUpperCase() {
    if (this.upperCase && this.operations) this.operations = this.operations.map(o => o.toUpperCase());
  }

  pressKey(ev: any, val: string | number) {
    console.log(val);
    leaveFocusOnButton(ev);
    this.evPressKeys.emit(val);
  }

  setColor(index: any) {
    return typeof this.colors === 'string' ? this.colors : this.colors[this.operations.indexOf(index)]
  }

  setDisabled(index: any) {
    return typeof this.disable === 'boolean' ? this.disable :
      this.disable === undefined ? this.disable : this.disable[this.operations.indexOf(index)]
  }
}
