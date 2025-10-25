import { ChevronLeft, ChevronRight, CircleX, Heart, ShoppingCart } from "lucide-react";
import React, { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getByProduct, getStatusProductList } from "@/api/product/queries";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { debounce } from "lodash";
import type { productPayload } from "@/api/product/types";
import { favouriteOrderDetails, orderDetails } from "@/api/order/queries";
import { addToFavourites } from "@/store/feature/favouriteSlice";
import { useDispatch } from "react-redux";
import { addToCarts } from "@/store/feature/cartSlice";
import { toast } from "sonner";
import { getProductbyCatInstance } from "@/api/category/queries";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [language, setLanguage] = useState<string>("us");
  const [status, setStatus] = useState<string>("NewArrival");
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [showDiscountProducts, setShowDiscountProducts] = useState(false);
  const [selectProductId, setSelectProductId] = useState<string | null>("");

  const catId = location.state?.catId || null;

  const {
    data: allStatus,
    isLoading,
    error,
  } = getStatusProductList.useQuery({
    pageNumber,
    pageSize,
    language,
    status,
  });

  const search = location.state?.search || "";
  const selectedProductID = location.state?.productID || null;

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

  const debouncedSetStatus = useCallback(
    debounce((value: string) => {
      setStatus(value);
      setPageNumber(1);
    }, 500),
    []
  );

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

  const handleStatusChange = (value: string) => {
    debouncedSetStatus(value);
    setStatus(value);
    setPageNumber(1);
    setShowDiscountProducts(false);
  };

  const { data: productById, isLoading: productDetailsLoading } =
    getByProduct.useQuery({ id: selectProductId || selectedProductID });

  const { data: productsByCatInstance } =
    getProductbyCatInstance.useQuery(catId);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      setPageNumber(newPage);
    }
  };

  const { mutate: addToCart } = orderDetails.useAddToCart({
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

  const shopDiscountClick = () => {
    setShowDiscountProducts(true);
    setStatus("");
    setPageNumber(1);
  };

  let filteredData;
  if (selectedProductID && productById) {
    filteredData = [productById];
  } else if (catId && productsByCatInstance) {
    filteredData = productsByCatInstance;
  } else {
    filteredData = allStatus;
  }

  if (search && filteredData) {
    filteredData = filteredData.filter((p: productPayload) =>
      p.productName.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (showDiscountProducts && filteredData) {
    filteredData = filteredData.filter((p: productPayload) => p.discount > 0);
  }

  const images = [
    { src: "/image/banner.webp" },
    { src: "/image/banner2.jpg" },
    { src: "/image/banner3.jpg" },
  ];

  const categories = [
    {
      src: "/image/body&bath.jpg",
      title: "Body&Bath",
    },
    {
      src: "/image/men.jpg",
      title: "Men",
    },
    {
      src: "/image/hair.jpg",
      title: "Hair",
    },
    {
      src: "/image/makeup.jpg",
      title: "Makeup",
    },
    {
      src: "/image/sunscreen.jpg",
      title: "Sunscreen",
    },
    {
      src: "/image/wellness.jpg",
      title: "Wellness",
    },
    {
      src: "/image/baby&mom.jpg",
      title: "Baby&Mom",
    },
    {
      src: "/image/skincare.jpg",
      title: "Skincare",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  const shopClick = () => {
    navigate("/productlist");
  };

  if (error) return <span className="flex justify-center items-center min-h-64 text-red-600 font-semibold">Oops! Something went wrong.</span>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-64 md:h-80 lg:h-96 xl:h-[510px] rounded-2xl overflow-hidden shadow-2xl group mb-8 md:mb-12">
          <div
            style={{ backgroundImage: `url(${images[currentIndex].src})` }}
            className="w-full h-full bg-center bg-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
          ></div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-4 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={28} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === slideIndex 
                    ? "bg-white scale-125" 
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Promo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card className="relative overflow-hidden bg-gradient-to-br from-rose-50 to-orange-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-rose-700">500000MMK Buy</p>
                  <p className="text-sm font-semibold text-rose-700">Delivery Free 1 Get</p>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Cosmetic Skin Perfectly</h2>
                <Button
                  onClick={shopClick}
                  className="bg-gradient-to-r from-rose-700 to-pink-700 hover:from-rose-800 hover:to-pink-800 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop Now
                </Button>
              </div>
              <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
                <img
                  src="/image/hair.jpg"
                  alt="Cosmetic Products"
                  className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <p className="text-sm font-semibold text-blue-700">15% Discount</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Hydrated Skin Perfectly</h2>
                <Button
                  onClick={shopDiscountClick}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop Discount
                </Button>
              </div>
              <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
                <img
                  src="/image/hair.jpg"
                  alt="Hydrated Skin Products"
                  className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
          {["NewArrival", "Special"].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                status === s
                  ? "bg-gradient-to-r from-rose-700 to-pink-700 text-white shadow-lg"
                  : "text-gray-600 hover:text-rose-700 bg-white shadow-md hover:shadow-lg"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          {!isLoading && !error && filteredData && (
            <div
              className={
                filteredData.length === 1
                  ? "flex justify-center"
                  : "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              }
            >
              {filteredData.length > 0 ? (
                filteredData.map((product: productPayload) => (
                  <Card
                    key={product.productId}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl"
                  >
                    <CardContent className="p-2">
                      <div
                        className="relative overflow-hidden rounded-md mb-4 cursor-pointer"
                        onClick={() => productByIdClick(product.productId)}
                      >
                        <img
                          src="/image/images.jpg"
                          alt={product.productName}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {product.discount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            -{product.discount}%
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToFavouriteClick(product);
                          }}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                        >
                          <Heart
                            size={18}
                            className={
                              likedProducts.includes(product.productId)
                                ? "text-red-500 fill-red-500"
                                : "text-gray-600"
                            }
                          />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-rose-700 transition-colors">
                          {product.productName}
                        </h3>
                        <p className="text-sm text-gray-600">{product.brandName}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {product.productDescription}
                        </p>

                        {/* Price Section */}
                        <div className="space-y-1">
                          {product.discount > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-rose-700">
                                {product.currencySymbol}
                                {(
                                  product.price -
                                  product.price * (product.discount / 100)
                                ).toLocaleString()}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {product.currencySymbol}
                                {product.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">
                              {product.currencySymbol}
                              {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Info */}
                        <p className="text-xs text-gray-500">
                          In Stock: <span className="font-semibold">{product.stockQTY}</span>
                        </p>

                        {/* Add to Cart Button */}
                        <Button
                          onClick={() => addToCartClick(product)}
                          className="w-full bg-gradient-to-r from-rose-700 to-pink-700 hover:bg-[#fa6262] text-white rounded-xl py-2.5 shadow-md"
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          Add To Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No products found.</p>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, index) => (
                <Card key={index} className="animate-pulse border-0 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 rounded h-4"></div>
                      <div className="bg-gray-200 rounded h-3 w-2/3"></div>
                      <div className="bg-gray-200 rounded h-3"></div>
                      <div className="bg-gray-200 rounded h-6 w-1/2"></div>
                      <div className="bg-gray-200 rounded h-10 mt-2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Dialog */}
        {selectProductId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
            <div
              className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeDialog}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110 shadow-lg"
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
                        className="rounded-2xl w-full max-w-md object-cover shadow-2xl"
                      />
                    </div>

                    <div className="flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {productById.productName}
                          </h2>
                          <p className="text-lg text-gray-600">{productById.brandName}</p>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {productById.productDescription}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-rose-700">
                              {productById.currencySymbol}
                              {productById.discount > 0
                                ? (
                                    productById.price -
                                    productById.price * (productById.discount / 100)
                                  ).toLocaleString()
                                : productById.price.toLocaleString()}
                            </span>
                            {productById.discount > 0 && (
                              <>
                                <span className="text-lg text-gray-400 line-through">
                                  {productById.currencySymbol}
                                  {productById.price.toLocaleString()}
                                </span>
                                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm font-bold">
                                  Save {productById.discount}%
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>In Stock: <strong>{productById.stockQTY}</strong></span>
                            {productById.discount > 0 && (
                              <span>Discount: <strong>{productById.discount}%</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={() => addToCartClick(productById as productPayload)}
                          className="flex-1 bg-gradient-to-r from-rose-700 to-pink-700 hover:bg-[#fa6262] text-white rounded-xl py-3 text-lg font-semibold"
                        >
                          <ShoppingCart size={20} className="mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={() => addToFavouriteClick(productById as productPayload)}
                          variant="outline"
                          className="flex-1 border-2 border-gray-300 hover:border-rose-300 hover:bg-rose-50 text-gray-700 rounded-xl py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
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
                        <p className="text-lg">Product not found.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pagination and Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 p-4">
          <div className="flex items-center gap-4">
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

          {/* Pagination */}
          <div className="flex-1 flex justify-center">
            {!isLoading && !error && allStatus && (
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
                        if (allStatus.length >= pageSize)
                          handlePageChange(pageNumber + 1);
                      }}
                      className={
                        allStatus.length < pageSize
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

      <div className="border-t border-b border-gray-200 py-8 bg-gradient-to-r from-gray-50 to-white">
        <Marquee gradient={false} speed={50}>
          <div className="flex gap-8 px-4">
            {categories.concat(categories).map((cat, index) => (
              <Link
                key={`${cat.title}-${index}`}
                to="/productlist"
                className="group flex flex-col items-center cursor-pointer transition-all duration-300 transform hover:scale-110"
              >
              <div className="w-24 h-24 overflow-hidden rounded-full flex items-center justify-center shadow">
                  <img
                    src={cat.src}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-rose-700 transition-colors">
                  {cat.title}
                </p>
              </Link>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
};

export default Home;