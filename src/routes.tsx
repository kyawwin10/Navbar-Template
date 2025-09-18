import type { RouteObject } from "react-router-dom";
import About from "./pages/about/About";
import ProductList from "./modules/product/ProductList";
import Home from "./pages/home/Home";
import Doctors from "./modules/doctor/Doctors";

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  {path: "/productlist", element: <ProductList />},
  // {path: "/booking", element: <Booking />},
  {path: "/doctorlist", element: <Doctors />}
];
