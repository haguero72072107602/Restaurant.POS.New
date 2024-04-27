export interface Aggregate {
  id: string;
  name: string;
  upc?: any;
  format: number;
  unitInStock: number;
  unitCost: number;
  applyTax: boolean;
  followDepartment: boolean;
  tax: number;
  ageVerification: boolean;
  ageAllow: number;
  foodStamp: boolean;
  generic: boolean;
  scalable: boolean;
  wic: boolean;
  departmentId?: any;
  prefixIsPrice: boolean;
  restaurantDetails: boolean;
  selected: boolean;
  count: number;
  color?: any;
  image?: any;
  price: number;
  isStar: boolean;
  starPrice: number;
  starHappyHourPrice: number;
  schedulerType: number;
  schedulerPrice: number;
  schedulerActive: boolean;
  printFinancial: boolean;
  buyX: number;
  payY: number;
  visible: boolean;
}

