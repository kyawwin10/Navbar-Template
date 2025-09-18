export type orderDetailsPayload = {
  productId: string;
  qty: number;
};

export type orderAddPayload = {
  orderDetails: orderDetailsPayload[];
  orderPlace: string;
  orderStartPoint: string;
  orderEndPoint: string;
  paymentType: string;
  deliFee: number;
};

export type favouriteListPayload = {
  productId: string
  qty: number
}

export type favouriteCartPayload = {
  favouriteItemsList: favouriteAddListPayload[];
  orderPlace: string;
  orderStartPoint: string;
  orderEndPoint: string;
  paymentType: string;
  deliFee: number;
};