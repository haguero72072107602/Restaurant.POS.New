import {LocalLayout} from "@models/local.layout.model";
import {StatusTable} from "@core/utils/operations";

export interface ITable {
  id: string;
  number?: number;
  label?: string;
  type?: 'table' | 'bar';
  chairNumber?: number;
  totalChairNumber?: number;
  status?: StatusTable;
  localLayoutId?: string;
  posUserId?: string;
  selected: boolean;
  localLayout?: LocalLayout
}

export class Table implements ITable {
  constructor(public id: string, public number?: number, public label?: string,
              public type?: 'table' | 'bar', public chairNumber?: number, public totalChairNumber?: number,
              public status?: StatusTable, public localLayoutId?: string, public posUserId?: string,
              public selected: boolean = false, public localLayout?: LocalLayout) {
  }
}

