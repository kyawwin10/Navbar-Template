import type { productPayload } from "@/api/product/types";
import React from "react";

interface ProductDetailsProps {
  productDetails: productPayload;
  isLoadings: boolean;
  errors: unknown;
  closeDialog: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({productDetails, isLoadings, errors}) => {
  if (isLoadings) return <div className="p-4 text-center">Loading...</div>;
  if (errors)
    return (
      <div className="p-4 text-center text-red-500">Error loading product</div>
    );
  if (!productDetails) return <div className="p-4 text-center">Product not found</div>;
  return (
    <>
      <div className="max-w-lg mx-auto shadow">
        <h2 className="text-xl font-bold mb-2">{productDetails.productName}</h2>
        <img
        //   src={productDetails.productImageUrl}
          src="/image/download.jpg"
          alt={productDetails.productName}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <p className="text-lg mb-1">Brand: {productDetails.brandName}</p>
        <p className="text-lg mb-1">
          Category: {productDetails.catInstanceName}
        </p>
        <p className="text-lg mb-1">{productDetails.productDescription}</p>
        <p className="text-xl font-bold mb-1">
          Price: {productDetails.currencySymbol || "$"}
          {productDetails.price}
        </p>
        <p className="text-lg mb-4">Stock: {productDetails.stockQTY}</p>
        {/* <button
          onClick={closeDialog}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button> */}
      </div>
    </>
  );
};

export default ProductDetails;
