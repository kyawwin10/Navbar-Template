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
import { CircleX, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { favouriteOrderDetails, orderDetails } from "@/api/order/queries";
import { useDispatch } from "react-redux";
import { addToCarts } from "@/store/feature/cartSlice";
import { useLocation } from "react-router-dom";
import { getProductbyCatInstance } from "@/api/category/queries";
import { addToFavourites } from "@/store/feature/favouriteSlice";

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const search = location.state?.search || "";

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
      discount: product.discount,
      currencySymbol: product.currencySymbol,
      productImageUrl: product.productImageUrl,
      qty: 1,
      stockQTY: 1,
    };
    dispatch(addToCarts(payload));
    addToCart([{ productId: product.productId, qty: 1 }]);
  };

  const addToFavouriteClick = (product: productPayload) => {
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
    dispatch(addToFavourites(payload));
    addToFavourite([{ productId: product.productId, qty: 1 }]);
  };

  const { mutate: addToFavourite } = favouriteOrderDetails.useAddToFavourite({
    onSuccess: () => {
      toast.success("Added to Favourite!");
    },
    onError: () => {
      toast.error("Failed to add to Favourite.");
    },
  });

  const productByIdClick = (productId: string) => {
    setSelectProductId(productId);
  };

  const closeDialog = () => {
    setSelectProductId("");
  };

  let filteredData;
  if (selectedProductID && productById) {
    filteredData = [productById];
  } else if (catId && productsByCatInstance) {
    filteredData = productsByCatInstance;
  } else {
    filteredData = allProducts;
  }

  if (search && filteredData) {
    filteredData = filteredData.filter((p: productPayload) =>
      p.productName.toLowerCase().includes(search.toLowerCase())
    );
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

      {/* ProductID Filter and Products */}
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
                <div
                  className="flex items-center justify-center"
                  onClick={() => productByIdClick(product.productId)}
                >
                  <img
                    // src={product.productImageUrl}
                    src="image/skincare.jpg"
                    alt={product.productName}
                    className="w-36 h-40 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <h2 className="text-sm font-semibold mt-2 text-[#731212]">
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
                <p className="text-xs text-gray-500">
                  {product.discount > 0 && <>Discount: {product.discount}%</>}
                </p>

                <div className="flex justify-center items-center gap-3 mt-2">
                  <Heart
                    onClick={() => addToFavouriteClick(product)}
                    className="cursor-pointer"
                    size={18}
                  />
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
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={closeDialog}
        >
          <div
            className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDialog}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              <CircleX size={28} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {productById ? (
                <>
                  <div className="flex items-center justify-center">
                    <img
                      // src={
                      //   productById.productImageUrl
                      // }
                      src="/image/hair.jpg"
                      alt={productById.productName}
                      className="rounded-xl w-60 h-60 object-cover shadow-md transition-transform hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {productById.productName}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {productById.brandName}
                      </p>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                        {productById.productDescription}
                      </p>
                    </div>

                    <div>
                      <p className="text-xl font-bold text-[#731212]">
                        {productById.currencySymbol}
                        {productById.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        In Stock: {productById.stockQTY}
                      </p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() =>
                            addToCartClick(productById as productPayload)
                          }
                          className="px-4 py-1.5 rounded-lg bg-[#731212] text-white hover:bg-red-800 transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() =>
                            addToFavouriteClick(productById as productPayload)
                          }
                          className="px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                        >
                          ❤️ Favourite
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="col-span-2 flex justify-center items-center p-6 text-gray-500">
                  {productDetailsLoading ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
                  ) : (
                    "Product not found."
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between w-full mt-8">
        {/* Page size */}
        <div className="shadow bg-white rounded-md border-[#731212]">
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 hover:text-[#731212] font-semibold"
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
        <div className="bg-white rounded-md">
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="px-2 py-1 font-semibold hover:text-[#731212]"
          >
            <option value="us">US</option>
            <option value="uk">UK</option>
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
