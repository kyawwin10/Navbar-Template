export type categoryGetAllPayload = {
  catId: string;
  catName: string;
};

export type categoryIdPayload = {
  catId: string;
};

export type categoryInstanceWithProductsPayload = {
  catInstanceId: string;
  catInstanceName: string;
  products: productPayload[];
};