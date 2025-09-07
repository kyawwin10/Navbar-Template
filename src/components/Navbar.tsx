import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";

import {
  getCategoryList,
  categoryInstancesWithProducts,
} from "@/api/category/queries";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import CartPage from "@/modules/cart/CartPage";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar: React.FC = () => {
  const [cartIconOpen, setCartIconOpen] = useState(false);

  const cart = useSelector((state: RootState) => state.cart.items);
  const totalItems = cart.reduce((sum, item) => sum + item.stockQTY, 0);
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading,
    error,
    isError,
  } = getCategoryList.useQuery();

  const flags = [
    { src: "image/usa_flag.webp", label: "English" },
    { src: "image/old_burmese_flag.png", label: "မြန်မာဘာသာ" },
  ];

  const [selectedFlag, setSelectedFlag] = useState(flags[0]);
  const [openCatId, setOpenCatId] = useState<string | null>(null);
  const logoutClick = () => {
    Cookies.remove("token");
    Cookies.remove("userName");
    Cookies.remove("roleName");
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (isError) {
    return <div>Error loading categories: {error?.message}</div>;
  }

  return (
    <>
      <header className="border-b border-gray-200">
        <div className="flex items-center justify-between px-22 py-4">
          {/* <img
            src="/image/LuxeLookLogo.jpg"
            alt="image"
            className="h-12 w-auto object-cover rounded-full shadow"
          /> */}
          <div className="text-3xl font-serif italic text-[#731212]">
            Luxe Look
          </div>

          <div className="flex-1 max-w-2xl mx-6">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Search entire store here..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
              />
              <button className="ml-2 text-white bg-black rounded-full p-2 hover:bg-gray-800 transition">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <img
                  className="w-6 h-4 cursor-pointer"
                  src={selectedFlag.src}
                  alt={selectedFlag.label}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="center">
                <DropdownMenuGroup>
                  {flags.map((flag) => (
                    <DropdownMenuItem
                      key={flag.label}
                      className={`mb-2 flex justify-around p-4 cursor-pointer ${
                        selectedFlag.label === flag.label
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setSelectedFlag(flag)}
                    >
                      <img
                        className="w-6 h-4"
                        src={flag.src}
                        alt={flag.label}
                      />
                      <DropdownMenuShortcut>{flag.label}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="hover:text-gray-600">
              <Heart className="h-6 w-6" />
            </button>
            <button
              className="hover:text-gray-600 relative"
              onClick={() => setCartIconOpen(true)}
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <CartPage
              open={cartIconOpen}
              onClose={() => setCartIconOpen(false)}
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-gray-600">
                <User className="h-6 w-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={logoutClick}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <nav className="flex flex-wrap justify-start items-center font-medium h-14 px-8 md:px-16 relative">
          {categories && categories.length > 0 ? (
            categories.map((cat) => {
              const isActive = location.pathname === `/${cat.catId}`;
              return (
                <div
                  key={cat.catId}
                  className="group"
                  onMouseEnter={() => setOpenCatId(cat.catId)}
                  onMouseLeave={() => setOpenCatId(null)}
                >
                  <div
                    className={`px-4 md:px-6 py-3 text-sm font-semibold md:text-base h-full flex items-center transition-all duration-200 ${
                      isActive
                        ? "text-[#C5A572] bg-gray-50 font-semibold border-b-2 border-[#C5A572]"
                        : "text-gray-800 hover:text-white hover:bg-[#C5A572] rounded-md"
                    }`}
                  >
                    {cat.catName}
                  </div>

                  {/* Dropdown (Mega Menu) */}
                  {openCatId === cat.catId && (
                    <div className="fixed left-0 right-0 top-[-18] ml-12 hidden group-hover:block w-[93vw] bg-white shadow-xl rounded-b-lg z-50">
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
            <p className="text-gray-500">Categories Not found.</p>
          )}
        </nav>

        <NavigationMenu viewport={true}>
          <NavigationMenuList>
            <NavigationMenuItem className="text-sm font-semibold">
              <NavigationMenuTrigger>Service</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to={"/doctors"}>Doctor</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to={"/booking"}>Booking</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
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
    error,
  } = categoryInstancesWithProducts.useQuery(catId);

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading categories...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Error loading instances: {error?.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 p-8">
      {instances?.map((instance) => (
        <div key={instance.catInstanceId} className="flex flex-col">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 hover:text-[#C5A572] transition-colors">
            {instance.catInstanceName}
          </h3>
          {instance.products.map((product) => (
            <Link
              key={product.productID}
              to={`/productlist`}
              className="text-sm text-gray-600 hover:text-[#C5A572] py-1.5 transition-colors"
              onClick={onClose}
            >
              {product.productName}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Navbar;
