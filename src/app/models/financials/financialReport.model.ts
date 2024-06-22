export interface FinancialReport {
  opening: number;
  closing: number;
  readingChange: number;
  openChecks: number;
  refunds: number;
  grossSale: number;
  taxSale: number;
  taxRefunds: number;
  saleWithTax: number;
  location: string;
  cashSale: number;
  cashAccountPayment: number;
  accountPaymentTotal: number;
  accountChargeTotal: number;
  saleTax: number;
  netSale: number;
  retailTotal: number;
  retailCount: number;
  retailAvgTickets: number;
  restaurantTotal: number;
  restaurantCount: number;
  restaurantAvgTickets: number;
  avgTickets: number;
  paidOut: number;
  paidIn: number;
  totalDue: number;
  cashDue: number;
  ticketsCount: number;
  voidTickets: number;
  discounts: number;
  tipAmount: number;
  merchantFee: number;
  lowestSale: number;
  averageSale: number;
  highestSale: number;
  openingTime: string;
  closeTime: string;
  companyId: string;
  bookedOn?: any;
  id: string;
  timeStamp: string;
  isDelete: boolean;
  readyToSync: boolean;
  rowVersion?: any;
}

export interface StationsSalesByPaymentRepor {
  terminalId: string;
  terminalName: string;
  cash: number;
  card: number;
  online: number;
  total: number;
}

export interface MediaReport {
  location: string;
  indexFile: number;
  fileDate: string;
  terminalID: string;
  terminalName: string;
  shift: string;
  mediaID: string;
  name: string;
  count: number;
  total: number;
  amount: number;
  paymentMethod: number;
  paymentType: string;
}

export interface DepartmentReport {
  location: string;
  indexFile: number;
  fileDate: string;
  indexPosition: string;
  description: string;
  numberSold: number;
  grossRevenue: number;
  itemDiscCount: number;
  itemDiscAmount: number;
  netRevenue: number;
  itemCountPercent: number;
  grossRevPercent: number;
  itemDiscPercent: number;
}

export interface SalesRepor {
  location: string;
  indexFile: number;
  fileDate: string;
  indexPosition: string;
  description: string;
  numberSold: number;
  itemWeight: number;
  grossRevenue: number;
  itemDiscCount: number;
  itemDiscAmount: number;
  netRevenue: number;
  itemCountPercent: number;
  grossRevPercent: number;
  itemDiscPercent: number;
}

export interface ApplicationUserReport {
  id: string;
  name: string;
  total: number;
  cash: number;
  card: number;
  online: number;
}

export interface ClockInReport {
  location: string;
  indexFile: number;
  fileDate: string;
  employeeId: string;
  ssn: number;
  employeeName: string;
  jobCode: string;
  jobCodeName: string;
  recordIndexEmployee: number;
  value0: string;
  payRate: number;
  clockIn: string;
  clockOut: string;
  value1: string;
  value2: string;
  value3: string;
  value4: string;
  value5: string;
  value6: string;
  lastUpdateTerminalId: string;
  lastUpdate: string;
  sequence: number;
}

export interface TipReport {
  terminalId: string;
  applicationUserId: string;
  userName: string;
  cashTipAmount: number;
  creditCardTipAmount: number;
  debitCardTipAmount: number;
  onlineTipAmount: number;
}

export interface InventorySubmajorRepor {
  productId: string;
  productName: string;
  userId?: any;
  userName?: any;
  initialQuantity: number;
  operationInQuantity: number;
  operationSalesQuantity: number;
  operationOtherUserQuantity: number;
  operationAdjustQuantity: number;
  operationRefundQuantity: number;
  finalQuantity: number;
}

export interface MediaDataViewModels {
  name: string;
  count: number;
  total: number;
  paymentType: string;
}

export interface PaymentsDataViewModels {
  name: string;
  count: number;
  total: number;
  paymentType: string;
}

export interface FinancialReportModel {
  financialReport: FinancialReport;
  stationsSalesByPaymentReport: StationsSalesByPaymentRepor[];
  mediaReport: MediaReport[];
  departmentReport: DepartmentReport[];
  salesReport: SalesRepor[];
  accountReport: any[];
  applicationUserReport: ApplicationUserReport[];
  clockInReport: ClockInReport[];
  tipReport: TipReport[];
  inventorySubmajorReport: InventorySubmajorRepor[];
  allowanceReport?: any;
  mediaDataViewModels: MediaDataViewModels[];
  paymentsDataViewModels: PaymentsDataViewModels[];
  isExport: boolean;
  filenamePrefix?: any;
  financialReportOperationType: number;
}
