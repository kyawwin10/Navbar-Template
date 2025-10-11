export type cartPayload = {
  productId: string;
  catInstanceName: string;
  brandName: string;
  productName: string;
  productDescription: string;
  stockQTY: number;
  cost: number;
  price: number;
  discount: number;
  currencySymbol: string;
  productImageUrl: string;
};

export type favouritePayload = {
  productId: string;
  catInstanceName: string;
  brandName: string;
  productName: string;
  productDescription: string;
  stockQTY: number;
  cost: number;
  price: number;
  currencySymbol: string;
  productImageUrl: string;
};