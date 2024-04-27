export interface IOption {
  id: string;
  name?: string;
  selected?: boolean;
}

export interface IAggregateProduct extends IOption {
  price?: number;
  count?: number;
  unitCost?: number;
}

export class Option {
  constructor(public id: string, public name?: string, public selected?: boolean) {
  }
}

export class AggregateProduct implements IAggregateProduct {
  constructor(public id: string, public name?: string, public selected?: boolean, price?: number, count?: number) {
  }
}
