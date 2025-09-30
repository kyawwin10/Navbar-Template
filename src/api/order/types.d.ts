export type orderDetailsPayload = {
  productId: string;
  qty: number;
};

export type orderAddPayload = {
  orderDetails: orderDetailsPayload[];
  fullName: string;
  region: string;
  phoneNumber: string;
  city: string;
  township: string;
  address: string;
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