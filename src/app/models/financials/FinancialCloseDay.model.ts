export interface FinancialCloseDayModel {
  date: string,
  closeTime: string;
  openingTime: string;
  cashDue: number,
  netSale: number,
  taxSale: number,
  tipAmount: number,
  readingChange: number,
  saleTax: number,
  userName: string,
  isManager: boolean,
  userId: string
}
