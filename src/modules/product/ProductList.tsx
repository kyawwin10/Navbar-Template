import React, { useCallback, useState } from "react";
import { getByProduct, getProductList } from "@/api/product/queries";
import type { productPayload } from "@/api/product/types";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { orderDetails } from "@/api/order/queries";
import ProductDetails from "./ProductDetails";
import { useDispatch } from "react-redux";
import { addToCarts } from "@/store/feature/cartSlice";
import { useLocation } from "react-router-dom";
import { getProductbyCatInstance } from "@/api/category/queries";

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [language, setLanguage] = useState<string>("us");
  const [selectProductId, setSelectProductId] = useState<string | null>("");

  const selectedProductID = location.state?.productID || null;
  const catId = location.state?.catId || null;

  const debouncedSetPageSize = useCallback(
    debounce((value: number) => {
      setPageSize(value);
      setPageNumber(1);
    }, 500),
    []
  );

  const debouncedSetLanguage = useCallback(
    debounce((value: string) => {
      setLanguage(value);
      setPageNumber(1);
    }, 500),
    []
  );

  const {
    data: allProducts,
    isLoading,
    error,
  } = getProductList.useQuery({
    pageNumber,
    pageSize,
    language,
  });

  const {
    data: productById,
    isLoading: productDetailsLoading,
    error: productDetailsError,
  } = getByProduct.useQuery({ id: selectProductId || selectedProductID });

  // const { data: filteredProduct } = getByProduct.useQuery({
  //   id: selectedProductID!,
  // });

  const { data: productsByCatInstance } =
    getProductbyCatInstance.useQuery(catId);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setPageNumber(newPage);
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    debouncedSetPageSize(Number(e.target.value));
    setPageSize(Number(e.target.value));
    setPageNumber(1);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    debouncedSetLanguage(e.target.value);
    setLanguage(e.target.value);
    setPageNumber(1);
  };

  const { mutate: addToCart, isPending } = orderDetails.useAddToCart({
    onSuccess: () => {
      toast.success("Added to cart!");
    },
    onError: () => {
      toast.error("Failed to add to cart.");
    },
  });

  const addToCartClick = (product: productPayload) => {
    const payload = {
      productId: product.productId,
      catInstanceName: product.catInstanceName ?? "",
      brandName: product.brandName,
      productName: product.productName,
      productDescription: product.productDescription,
      cost: product.cost ?? 0,
      price: product.price,
      currencySymbol: product.currencySymbol,
      productImageUrl: product.productImageUrl,
      qty: 1,
      stockQTY: 1,
    };
    dispatch(addToCarts(payload));
    addToCart([{ productId: product.productId, qty: 1 }]);
  };

  const productByIdClick = (productId: string) => {
    setSelectProductId(productId);
  };

  const closeDialog = () => {
    setSelectProductId("");
  };
  //   let filteredData;

  // if (selectedProductID && selectedProductID !== "") {
  //   if (filteredProduct) {
  //     filteredData = [filteredProduct];
  //   } else {
  //     filteredData = allProducts?.filter(
  //       (product: productPayload) => product.productId === selectedProductID
  //     );
  //   }
  // } else {
  //   filteredData = allProducts;
  // }

  let filteredData;
  if (selectedProductID && productById) {
    filteredData = [productById];
  } else if (catId && productsByCatInstance) {
    filteredData = productsByCatInstance;
  } else {
    filteredData = allProducts;
  }

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-semibold mb-2 text-center">Products</h1> */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="text-center text-red-500">
          Error fetching products: {(error as Error).message}
        </div>
      )}

      {/* ProductID Filter and Product */}
      {!isLoading && !error && filteredData && (
        <div
          className={
            filteredData.length === 1
              ? "flex justify-center"
              : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          }
        >
          {filteredData.length > 0 ? (
            filteredData.map((product: productPayload) => (
              <div
                key={product.productId}
                className="flex flex-col items-center text-center"
              >
                <div className="w-30 h-38 flex items-center justify-center rounded shadow">
                  <img
                    src="image/skincare.jpg"
                    alt={product.productName}
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={() => productByIdClick(product.productId)}
                  />
                </div>

                <h2 className="text-sm font-semibold mt-2">
                  {product.productName}
                </h2>
                <p className="text-sm text-[#731212]">{product.brandName}</p>
                <p className="text-sm text-[#731212] line-clamp-2">
                  {product.productDescription}
                </p>

                <p className="text-base font-bold mt-1">
                  {product.currencySymbol}
                  {product.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  In Stock: {product.stockQTY}
                </p>

                <div className="flex justify-center items-center gap-3 mt-2">
                  <Heart className="cursor-pointer" size={18} />
                  <Button
                    disabled={isPending}
                    className="text-white rounded px-3 py-1 text-sm"
                    onClick={() => addToCartClick(product)}
                  >
                    Add To Cart
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full">
              No products found for "{selectedProductID}".
            </div>
          )}
        </div>
      )}

      {/* Dialog for Product Details */}
      {selectProductId && (
        <div className="fixed inset-0 bg-opacity-100 flex items-center justify-center z-50">
          <div className="bg-[#f8f8f8] rounded-lg max-w-lg w-full mx-4 relative">
            <button
              onClick={() => closeDialog()}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            {/* Conditionally render ProductDetails only when data is available */}
            {productById ? (
              <ProductDetails
                productDetails={productById}
                isLoadings={productDetailsLoading}
                errors={productDetailsError}
                closeDialog={closeDialog}
              />
            ) : (
              <div className="p-4 text-center">
                {productDetailsLoading ? "Loading..." : "Product not found."}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between w-full mt-8">
        {/* Page size */}
        <div>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Pagination */}
        <div className="flex-1 flex justify-center">
          {!isLoading && !error && allProducts && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      if (pageNumber > 1) handlePageChange(pageNumber - 1);
                    }}
                    className={
                      pageNumber === 1 ? "pointer-events-none opacity-70" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(5)].map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === pageNumber}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      if (allProducts.length >= pageSize)
                        handlePageChange(pageNumber + 1);
                    }}
                    className={
                      allProducts.length < pageSize
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Price currencies */}
        <div>
          <label htmlFor="language" className="mr-2 font-medium">
            Price Currencies:
          </label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="border rounded px-2 py-1"
          >
            <option value="us">English (US)</option>
            <option value="uk">English (UK)</option>
            <option value="thailand">Spanish</option>
            <option value="japan">Japan</option>
            <option value="myanmar">Myanmar</option>
            <option value="canada">Canada</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
