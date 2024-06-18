export interface ICashSales {
  cashSales: number;
  cashAccountPayments: number;
  paidOut: number;
  paidIn: number;
  cashDue: number;
  ticks: number;
  avgTicks: number;
}

export class CashSales implements ICashSales {
  constructor(public cashSales: number, public cashAccountPayments: number,
              public paidOut: number, public paidIn: number, public cashDue: number, public ticks: number,
              public avgTicks: number) {
  }
}
