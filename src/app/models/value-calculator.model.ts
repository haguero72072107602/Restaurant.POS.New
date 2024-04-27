import {TypeKey} from "@core/utils/typekey.enum";

/**
 * Created by tony on 23/10/2018.
 */
export class ValueCalculator {
  constructor(public value: string | number, public type: TypeKey) {
  }
}
