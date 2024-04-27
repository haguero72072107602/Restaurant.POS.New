export interface Inventory {
  id: string;
  name: string;
  upc: string;
  unitInStock: number;
  unitCost: number;
  categoryComponentId: string
  measureId: string;
  measure: string;
  currentPrice: number;
  regularPrice: number;
  image: Uint8Array;
  expiryDate: Date;
  amount: number;
  minimumStock: number;
  imageBase64?: string | null;
  isRefundable: boolean;
  description: string;
}
