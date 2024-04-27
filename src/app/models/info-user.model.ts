export type ClientSale = {
  orderCount?: number;
  averageSale?: number;
  highSale?: number;
  totalSale?: number;
}

export type Table = {
  id: string;
  number: number;
  chairNumber: number;
  label: string;
  totalChairNumber: number;
  status: number;
  localLayoutId: string;
  localLayout?: any;
  posUserId?: any;
}

export type Address = {
  street: string;
  city?: any;
  state?: any;
  country?: any;
  zipCode?: any;
}

export type Client = {
  id: string;
  name: string;
  address: Address;
  phone?: any;
  email?: any;
  company?: any;
  birthday: string;
  gender: number;
  preferredPaymentMethod: number;
  credit: number;
  balance: number;
  creditLimit: number;
  giftAmount: number;
}

export type Order = {
  id: string;
  invoiceId: string;
  status: number;
  type: number;
  description?: any;
  tableId: string;
  paidDate?: any;
  table: Table;
  client: Client;
}

export type ProductOrders = {
  id: string;
  quantity: number;
  unitCost: number;
  currentPrice: number;
  total: number;
  tax: number;
  subTotal: number;
  productId: string;
  productUpc: string;
  productName: string;
  foodStamp: boolean;
  isRefund: boolean;
  discount: number;
  discountType?: any;
  saved: number;
  restaurantDetails: boolean;
  preparationMode?: any;
  sides?: any;
  position: number;
  note: string;
  isStar: boolean;
  isHappyHour: boolean;
  starPrice: number;
  starHappyHourPrice: number;
  schedulerType: number;
  schedulerPrice: number;
  schedulerActive: boolean;
  buyX: number;
  payY: number;
  firstFree: boolean;
  groupDetails: any[];
  aggregateProductOrders: any[];
}

export type Payments = {
  id: string;
  date: string;
  mediaType: number;
  paymentMethod: number;
  balance: number;
  paymentMethodViewModel?: any;
  transferType?: any;
  paymentResult: number;
  merchantFee: number;
  tipAmount: number;
  subCharge: number;
}

export type ClientProductOrders = {
  order: Order;
  productOrders: ProductOrders[];
  payments: Payments[];
}

export type InfoCustomer = {
  id: string;
  name: string;
  phone?: any;
  email?: any;
  birthday: string;
  gender: number;
  favorites: string;
  clientSales?: ClientSale;
  clientProductOrders?: ClientProductOrders[];
}
