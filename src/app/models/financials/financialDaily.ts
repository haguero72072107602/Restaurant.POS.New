export interface FinancialDaily {
  dailyDate: string;
  refunds: number;
  taxRefunds: number;
  openChecks: number;
  voidTickets: number;
  saleWithTax: number;
  taxSale: number;
  countTicketSale: number;
  retailTotal: number;
  retailCount: number;
  restaurantTotal: number;
  restaurantCount: number;
  discounts: number;
  tipAmount: number;
}

