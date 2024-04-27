export interface PaymentInvoice {
  paymentMethod: string,
  invoiceId: string,
  paymentId: string
  tip: number,
  confirmationCode: string,
  amount: number;
  card: string;
}

