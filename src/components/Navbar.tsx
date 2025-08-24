// src/components/Navbar.tsx
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const Navbar = () => {
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Order", path: "/order" },
  ];

  const flags = [
    { src: "image/usa_flag.webp", label: "English" },
    { src: "image/old_burmese_flag.png", label: "မြန်မာဘာသာ" },
  ];

  const [selectedFlag, setSelectedFlag] = useState(flags[0]);

  return (
    <>
      <header className="border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-3xl font-serif italic">Luxe Look</div>

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

          {/* Icons */}
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
                      className={`mb-2 flex justify-around p-4 cursor-pointer ${selectedFlag.label == flag.label ? "bg-gray-200" : "hover:bg-gray-100"}`}
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
            <button className="hover:text-gray-600">
              <ShoppingBag className="h-6 w-6" />
            </button>
            <button className="hover:text-gray-600">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="flex justify-center items-center gap-4 shadow h-12">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-violet-500 px-4 py-3 font-serif text-md h-full flex items-center"
                  : "text-black text-md px-4 py-3 font-serif hover:bg-violet-600 hover:text-white h-full flex items-center"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
