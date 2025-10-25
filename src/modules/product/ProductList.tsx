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
import { CircleX, Heart, ShoppingCart, Star, Filter, Grid3X3, List } from "lucide-react";
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
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [language, setLanguage] = useState<string>("us");
  const [selectProductId, setSelectProductId] = useState<string | null>("");
  const [sortBy, setSortBy] = useState<string>("name");

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

  const { data: productsByCatInstance } =
    getProductbyCatInstance.useQuery(catId);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setPageNumber(newPage);
    }
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
    setLikedProducts((prev) =>
      prev.includes(product.productId)
        ? prev.filter((id) => id !== product.productId)
        : [...prev, product.productId]
    );
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

  if (filteredData) {
    filteredData = [...filteredData].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.productName.localeCompare(b.productName);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">View:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm text-rose-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list"
                        ? "bg-white shadow-sm text-rose-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {[...Array(8)].map((_, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-sm border border-gray-200 animate-pulse ${viewMode === "list" ? "flex gap-4 p-6" : "p-4"}`}>
                <div className={`bg-gray-200 rounded-xl ${viewMode === "list" ? "w-32 h-32" : "w-full h-48"}`}></div>
                <div className={`flex-1 ${viewMode === "list" ? "space-y-3" : "space-y-2 mt-4"}`}>
                  <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                  <div className="bg-gray-200 rounded h-3 w-1/2"></div>
                  <div className="bg-gray-200 rounded h-6 w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to load products
            </h3>
            <p className="text-gray-600">Please check your connection and try again</p>
          </div>
        )}

        {/* Products Grid/List */}
        {!isLoading && !error && filteredData && (
          <div className={`gap-6 ${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "flex flex-col"}`}>
            {filteredData.length > 0 ? (
              filteredData.map((product: productPayload) => (
                <div
                  key={product.productId}
                  className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group ${
                    viewMode === "list" ? "flex gap-6 p-6" : "p-4"
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`relative overflow-hidden cursor-pointer ${
                      viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
                    }`}
                    onClick={() => productByIdClick(product.productId)}
                  >
                    <img
                      src="/image/images.jpg"
                      alt={product.productName}
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                        viewMode === "list" ? "w-48 h-48" : "w-full h-48"
                      }`}
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToFavouriteClick(product);
                      }}
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          likedProducts.includes(product.productId)
                            ? "text-rose-500 fill-rose-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className={`flex flex-col ${viewMode === "list" ? "flex-1 justify-between" : "mt-4"}`}>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-rose-600 transition-colors mb-2">
                        {product.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                      <p className={`text-gray-500 ${viewMode === "list" ? "text-sm leading-relaxed" : "text-xs line-clamp-2"}`}>
                        {product.productDescription}
                      </p>
                    </div>

                    <div className={`${viewMode === "list" ? "mt-4" : "mt-3"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-rose-600">
                            {product.currencySymbol}
                            {product.discount > 0
                              ? (product.price - product.price * (product.discount / 100)).toLocaleString()
                              : product.price.toLocaleString()}
                          </span>
                          {product.discount > 0 && (
                            <span className="text-sm text-gray-400 line-through">
                              {product.currencySymbol}
                              {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-500">4.8</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>
                          Stock:
                            {product.stockQTY}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-rose-600 font-medium">
                            Save {product.currencySymbol}
                            {(product.price * (product.discount / 100)).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Button
                        disabled={isPending}
                        onClick={() => addToCartClick(product)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-2.5 transition-all duration-300"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isPending ? "Adding..." : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  {search ? `No results for "${search}"` : "Try adjusting your search criteria"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Product Details Modal */}
        {selectProductId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
            <div
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeDialog}
                className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <CircleX size={24} className="text-gray-600" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                {productById ? (
                  <>
                    <div className="flex items-center justify-center">
                      <img
                        src="/image/hair.jpg"
                        alt={productById.productName}
                        className="rounded-2xl w-full max-w-md object-cover shadow-lg"
                      />
                    </div>

                    <div className="flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {productById.productName}
                          </h2>
                          <p className="text-lg text-gray-600">{productById.brandName}</p>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {productById.productDescription}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-rose-600">
                              {productById.currencySymbol}
                              {productById.discount > 0
                                ? (productById.price - productById.price * (productById.discount / 100)).toLocaleString()
                                : productById.price.toLocaleString()}
                            </span>
                            {productById.discount > 0 && (
                              <>
                                <span className="text-lg text-gray-400 line-through">
                                  {productById.currencySymbol}
                                  {productById.price.toLocaleString()}
                                </span>
                                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-medium">
                                  Save {productById.discount}%
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              In Stock:{productById.stockQTY}
                            </span>
                            {productById.discount > 0 && (
                              <span>Discount: <span className="font-medium">{productById.discount}%</span></span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={() => addToCartClick(productById as productPayload)}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg py-3 text-lg font-semibold"
                        >
                          <ShoppingCart size={20} className="mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => addToFavouriteClick(productById as productPayload)}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-rose-300 hover:bg-rose-50 text-gray-700 rounded-lg py-3 text-lg font-semibold"
                        >
                          <Heart
                            size={20}
                            className="mr-2"
                            fill={likedProducts.includes(productById.productId) ? "currentColor" : "none"}
                          />
                          Favourite
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 flex justify-center items-center p-12">
                    {productDetailsLoading ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="text-6xl mb-4">❌</div>
                        <p className="text-lg">Product not found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-4">
            <div className="flex items-center bg-white">
              <select
                id="pageSize"
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-4 py-2 border border-[#dcdcdc] rounded-lg"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

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
                          pageNumber === 1 
                            ? "pointer-events-none opacity-50" 
                            : "hover:bg-rose-50 hover:text-rose-700 transition-colors"
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
                            className={
                              page === pageNumber
                                ? "bg-rose-700 text-white hover:bg-rose-800"
                                : "hover:bg-rose-50 hover:text-rose-700"
                            }
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
                            : "hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>

            <div className="flex items-center border-[#dcdcdc] bg-white rounded-md">
              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
                className="px-2 py-1 border border-[#dcdcdc] rounded-lg font-semibold hover:text-[#731212]"
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
    </div>
  );
};

export default ProductList;