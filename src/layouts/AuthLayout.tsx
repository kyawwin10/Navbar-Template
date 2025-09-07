// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100">
      <Outlet />
    </div>
  );
};

export default AuthLayout;