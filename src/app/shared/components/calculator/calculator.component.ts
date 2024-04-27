import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {TypeKey} from "@core/utils/typekey.enum";
import {ValueCalculator} from "@models/value-calculator.model";

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  @Output() evKeys = new EventEmitter<any>();
  @Input() rightOperations = ["Clear", "PLU", "Print Check", "Void"];
  @Input() numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "00", "@/FOR"];
  @Input() leftOperations = ["F/S Subtotal", "Subtotal"];
  @Input() valid: boolean | any;
  space = "5px";
  protected readonly TypeKey = TypeKey;

  constructor(private op: OperationsService) {
  }

  ngOnInit() {
  }

  sendKey(val: string | number, type: TypeKey) {
    console.log(type);
    if (Number(type) === TypeKey.NUMBER && val === this.numbers[this.numbers.length - 1]) {
      type = TypeKey.FOR;
    }
    this.evKeys.emit(new ValueCalculator(val, type));
    this.op.resetInactivity(true, 'calculator ' + val);
  }
}
