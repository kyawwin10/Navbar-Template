export type getAllProductPayload = {
    pageNumber: number
    pageSize: number
    language: string
}

export type productPayload = {
  productId: string;
  catInstanceName: string;
  brandName: string;
  productName: string;
  productDescription: string;
  stockQTY?: number;
  cost: number;
  price: number;
  currencySymbol: string;
  productImageUrl: string;
};

export type productGetByIdPayload = {
  id: string
}

export type CategoryInstance = {
  catInstanceName: string;
  products: Product[];
};

export type imageParamUploadPayload = {
  image: File
}

export type fileUploadPayload = {
  url: string
}