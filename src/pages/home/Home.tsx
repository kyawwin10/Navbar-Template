import { ChevronLeft, ChevronRight, CircleX, Heart } from "lucide-react";
import React, { useCallback, useState } from "react";
import { RxDotFilled } from "react-icons/rx";
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

  const images = [
    { src: "/image/LuxeLook10.png" },
    { src: "/image/luxelook2.jpg" },
    { src: "/image/luxelook11.png" },
    { src: "/image/luxelook13.png" },
    { src: "/image/p2.png" },
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

  if (error) return <span>Oops!</span>;

  return (
    <>
      <div className="max-w-full h-[510px] w-full m-auto relative group mb-5">
        <div
          style={{ backgroundImage: `url(${images[currentIndex].src})` }}
          className="w-full h-full bg-center bg-cover duration-500"
        ></div>

        <div
          onClick={prevSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full bg-black/20 text-white cursor-pointer"
        >
          <ChevronLeft size={30} />
        </div>

        <div
          onClick={nextSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full bg-black/20 text-white cursor-pointer"
        >
          <ChevronRight size={30} />
        </div>

        <div className="flex justify-center">
          {images.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`text-2xl cursor-pointer ${
                currentIndex === slideIndex ? "text-black" : "text-gray-400"
              }`}
            >
              <RxDotFilled />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Card 1 */}
        <Card className="flex flex-col md:flex-row items-center md:items-start justify-between p-6 bg-[#f5e9dc] shadow">
          <CardContent className="flex-1 space-y-3 mt-8">
            <p className="text-sm font-medium text-gray-600">500000MMK Buy</p>
            <p className="text-sm font-medium text-gray-600">
              Delivery Free 1 Get
            </p>
            <h2 className="text-xl font-semibold">Cosmetic Skin Perfectly</h2>
            <Button
              onClick={shopClick}
              className="bg-pink-700 hover:bg-pink-800 text-white rounded-full px-6 mt-4"
            >
              Shop Now
            </Button>
          </CardContent>
          <div className="mt-4 h-full md:mt-0 md:ml-4 flex-shrink-0">
            <img
              src="/image/hair.jpg"
              alt="image"
              className="w-50 md:w-48 object-contain"
            />
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="flex flex-col md:flex-row items-center md:items-start justify-between p-6 bg-[#f5e9dc] shadow">
          <CardContent className="flex-1 space-y-3 mt-14">
            <p className="text-sm font-medium text-gray-600">15% Discount</p>
            <h2 className="text-xl font-semibold">Hydrated Skin Perfectly</h2>
            <Button className="bg-pink-700 hover:bg-pink-800 text-white rounded-full px-6 mt-6">
              Shop Now
            </Button>
          </CardContent>
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <img
              src="/image/hair.jpg"
              alt="Hydrated Skin"
              className="w-40 md:w-48 object-contain"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-center items-center gap-8 my-6">
        {["NewArrival", "Special"].map((s) => (
          <div
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`text-sm font-semibold p-1 rounded cursor-pointer transition-colors
        ${
          status === s
            ? "bg-[#731212] text-white hover:bg-[#922222]"
            : "text-gray-700 hover:text-[#731212]"
        }`}
          >
            {s}
          </div>
        ))}
      </div>

      <div className="container mx-auto p-4">
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

                  <div className="flex justify-center items-center gap-3 mt-2">
                    <Heart
                      onClick={() => addToFavouriteClick(product)}
                      className="cursor-pointer"
                      size={18}
                      color={
                        likedProducts.includes(product.productId)
                          ? "red"
                          : "currentColor"
                      }
                      fill={
                        likedProducts.includes(product.productId)
                          ? "red"
                          : "none"
                      }
                    />
                    <Button
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
                        if (allStatus.length >= pageSize)
                          handlePageChange(pageNumber + 1);
                      }}
                      className={
                        allStatus.length < pageSize
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
      <div className="bg-gray-700 my-4 h-[0.5px] mx-6 shadow-lg"></div>

      <Marquee>
        <div className="flex gap-10 justify-center flex-wrap mt-6 mb-10 ml-10">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to="/productlist"
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-24 h-24 overflow-hidden rounded-full flex items-center justify-center shadow">
                <img
                  src={cat.src}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold tracking-wide text-gray-700">
                {cat.title}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex gap-10 justify-center flex-wrap mt-6 mb-10 ml-10">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to="/productlist"
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-24 h-24 overflow-hidden rounded-full flex items-center justify-center shadow">
                <img
                  src={cat.src}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold tracking-wide text-gray-700">
                {cat.title}
              </p>
            </Link>
          ))}
        </div>
      </Marquee>
    </>
  );
};

export default Home;
