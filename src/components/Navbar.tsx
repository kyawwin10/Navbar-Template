import { Heart, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState, useEffect } from "react";

import {
  getCategoryList,
  categoryInstancesWithProducts,
} from "@/api/category/queries";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import CartPage from "@/modules/cart/CartPage";

const Navbar: React.FC = () => {
  const profileImageUrl = Cookies.get("profileImageUrl");
  const [cartIconOpen, setCartIconOpen] = useState(false);
  const [favouriteIconOpen, setFavouriteIconOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const location = useLocation();
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalItems = cart.reduce((sum, item) => sum + item.stockQTY, 0);

  const favourite = useSelector((state: RootState) => state.favourite.items);
  const totalFavourites = favourite.reduce((sum, item) => sum + item.stockQTY, 0);
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading,
    error,
    isError,
  } = getCategoryList.useQuery();

  const [openCatId, setOpenCatId] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logoutClick = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("roleName");
    Cookies.remove("profileImageUrl");
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (isError) {
    return <div>Error loading categories: {error?.message}</div>;
  }
  // const handleSearch = () => {
  //   navigate("/productlist", { state: { search: search } });
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    navigate("/productlist", { state: { search: value } });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/productlist", { state: { search: search } });
  };

  const navLinkClass = (isActive: boolean) =>
    `px-3 py-2 md:px-4 md:py-3 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
      isActive
        ? "text-white bg-gradient-to-r from-rose-700 to-pink-700 shadow-lg"
        : "text-gray-700 hover:text-rose-700 hover:bg-rose-50"
    }`;

  if (isLoading) {
    return (
      <div className="w-full h-20 bg-white/80 backdrop-blur-md shadow-sm animate-pulse"></div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className={`bg-gradient-to-r from-gray-900 to-gray-800 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Customer Service */}
              <div className="text-sm font-medium text-white hidden md:block">
                Customer Service:{" "}
                <a href="tel:+959404159420" className="hover:text-rose-200 transition-colors">
                  (+95) 9404159420
                </a>
              </div>

              {/* Brand Logo */}
              <div className="flex-1 md:flex-none text-center">
                <h1 className="text-2xl md:text-3xl font-bold italic text-white tracking-wide">
                  Luxe<span className="text-rose-300">Look</span>
                </h1>
              </div>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={handleSearch}
                    className="w-64 pl-4 pr-10 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>

                {/* Favourite */}
                <button 
                  onClick={() => setFavouriteIconOpen(true)}
                  className="relative p-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Heart className="h-5 w-5" />
                  {totalFavourites > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {totalFavourites}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => setCartIconOpen(true)}
                  className="relative p-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    {profileImageUrl ? (
                      <img
                        src={profileImageUrl}
                        alt="Profile"
                        className="h-8 w-8 rounded-full shadow-lg"
                         style={{ backgroundColor: "#eee" }}
                        />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-[#731212] shadow-lg">
                        <User className="h-4 w-4 text-[#731212]" />
                      </div>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-2 border-0 shadow-xl rounded-xl bg-white/95 backdrop-blur-sm">
                    <DropdownMenuItem 
                      onClick={logoutClick}
                      className="cursor-pointer text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors rounded-lg"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className={`bg-white/95 backdrop-blur-md shadow-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <Link
                  to="/home"
                  className={navLinkClass(location.pathname === "/home" || location.pathname === "/")}
                >
                  Home
                </Link>

                {categories && categories.length > 0 ? (
                  categories.map((cat) => {
                    const isActive = location.pathname === `/${cat.catId}`;
                    return (
                      <div
                        key={cat.catId}
                        className="relative group"
                        onMouseEnter={() => setOpenCatId(cat.catId)}
                        onMouseLeave={() => setOpenCatId(null)}
                      >
                        <Link
                          to="/productList"
                          className={navLinkClass(isActive)}
                        >
                          {cat.catName}
                        </Link>

                        {/* Dropdown */}
                        {openCatId === cat.catId && (
                          <div className="absolute left-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 animate-in fade-in-0 zoom-in-95">
                            <CategoryInstanceDropdown
                              catId={cat.catId}
                              onClose={() => setOpenCatId(null)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 px-4">No categories</p>
                )}

                <Link
                  to="/doctorlist"
                  className={navLinkClass(location.pathname === "/doctorlist")}
                >
                  Service
                </Link>
              </div>

              {/* Mobile Search Bar */}
              <div className="md:hidden flex-1 max-w-xs">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full pl-3 pr-8 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-rose-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-in slide-in-from-top duration-300">
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/home"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={navLinkClass(location.pathname === "/home" || location.pathname === "/")}
                  >
                    Home
                  </Link>

                  {categories && categories.map((cat) => (
                    <div key={cat.catId} className="relative">
                      <Link
                        to="/productList"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={navLinkClass(location.pathname === `/${cat.catId}`)}
                      >
                        {cat.catName}
                      </Link>
                    </div>
                  ))}

                  <Link
                    to="/doctorlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={navLinkClass(location.pathname === "/doctorlist")}
                  >
                    Service
                  </Link>

                  {/* Mobile Actions */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 mt-2">
                    <button 
                      onClick={() => {
                        setFavouriteIconOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="relative p-2 text-gray-700 hover:text-rose-700 transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      {totalFavourites > 0 && (
                        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {totalFavourites}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setCartIconOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="relative p-2 text-gray-700 hover:text-rose-700 transition-colors"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Cart and Favourite Modals */}
      <CartPage
        cartOpen={cartIconOpen}
        favouriteOpen={favouriteIconOpen}
        onCartClose={() => setCartIconOpen(false)}
        onFavClose={() => setFavouriteIconOpen(false)}
      />
    </>
  );
};

const CategoryInstanceDropdown: React.FC<{
  catId: string;
  onClose: () => void;
}> = ({ catId, onClose }) => {
  const {
    data: instances,
    isLoading,
    isError,
  } = categoryInstancesWithProducts.useQuery(catId);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500 text-sm">
        Error loading categories
      </div>
    );
  }

  return (
    <div className="p-6 max-h-96 overflow-y-auto">
      <div className="grid grid-cols-1 gap-6">
        {instances?.map((instance) => (
          <div key={instance.catInstanceId} className="space-y-3">
            <h3
              className="font-semibold text-gray-900 hover:text-rose-700 transition-colors cursor-pointer text-lg border-b border-gray-100 pb-2"
              onClick={() => {
                navigate("/productlist", { state: { catId } });
                onClose();
              }}
            >
              {instance.catInstanceName}
            </h3>
            <div className="space-y-1 pl-2">
              {instance.products.map((product) => (
                <div
                  key={product.productID}
                  className="text-sm text-gray-600 hover:text-rose-700 py-1.5 transition-colors cursor-pointer hover:pl-2 duration-200"
                  onClick={() => {
                    navigate("/productlist", {
                      state: { productID: product.productID },
                    });
                    onClose();
                  }}
                >
                  {product.productName}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;