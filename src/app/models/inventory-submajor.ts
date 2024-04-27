export interface IInventorySubmajor {
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  initialQuantity: number;
  operationInQuantity: number;
  operationSalesQuantity: number;
  operationOtherUserQuantity: number;
  operationAdjustQuantity: number;
  operationRefundQuantity: number;
  finalQuantity: number;
}
