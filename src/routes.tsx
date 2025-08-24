import type { RouteObject } from "react-router-dom";
import Home from "./pages/home/Home"
import About from "./pages/about/About";
import Order from "./pages/order/Order";

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/profile", element: <Order /> },
];
